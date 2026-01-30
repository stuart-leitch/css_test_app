import Foundation

struct CSSResult {
    let css: Double
    let pace200: Double
    let pace400: Double
}

enum CSSError: Error, LocalizedError {
    case invalidInput
    case timesMustBePositive
    case time200TooFast
    case time200TooSlow
    case time400TooFast
    case time400TooSlow
    case time400MustBeGreater
    case pace400CannotBeFaster
    case secondsMustBeLessThan60
    
    var errorDescription: String? {
        switch self {
        case .invalidInput:
            return "Invalid time format"
        case .timesMustBePositive:
            return "Times must be positive values"
        case .time200TooFast:
            return "Time must be at least \(CSSCalculator.formatTime(CSSConstants.time200.min))"
        case .time200TooSlow:
            return "Time must be less than \(CSSCalculator.formatTime(CSSConstants.time200.max))"
        case .time400TooFast:
            return "Time must be at least \(CSSCalculator.formatTime(CSSConstants.time400.min))"
        case .time400TooSlow:
            return "Time must be less than \(CSSCalculator.formatTime(CSSConstants.time400.max))"
        case .time400MustBeGreater:
            return "400m time must be greater than 200m time"
        case .pace400CannotBeFaster:
            return "400m pace cannot be faster than 200m pace"
        case .secondsMustBeLessThan60:
            return "Seconds must be less than 60"
        }
    }
}

class CSSCalculator {
    
    /// Parse flexible time input into total seconds
    /// Supports: MM:SS, MM.SS, MM SS, MM:SS.s, or plain seconds
    static func parseTimeInput(_ input: String) -> Double? {
        let trimmed = input.trimmingCharacters(in: .whitespaces)
        
        guard !trimmed.isEmpty else { return nil }
        
        // Check for MM:SS format (colon separator, with optional decimal seconds)
        if trimmed.contains(":") {
            let parts = trimmed.split(separator: ":")
            if parts.count == 2,
               let minutes = Int(parts[0]),
               let seconds = Double(parts[1]),
               minutes >= 0, seconds >= 0, seconds < 60 {
                return Double(minutes) * 60 + seconds
            }
            return nil
        }
        
        // Check for MM SS format (space separator)
        if trimmed.contains(" ") {
            let parts = trimmed.split(whereSeparator: { $0.isWhitespace })
            if parts.count == 2,
               let minutes = Int(parts[0]),
               let seconds = Double(parts[1]),
               minutes >= 0, seconds >= 0, seconds < 60 {
                return Double(minutes) * 60 + seconds
            }
            return nil
        }
        
        // Check for MM.SS format (period as separator, not decimal)
        // Only treat as MM.SS if: format is X.YY where YY is 00-59 AND minutes <= 12
        let periodPattern = #"^(\d+)\.(\d{2})$"#
        if let regex = try? NSRegularExpression(pattern: periodPattern),
           let match = regex.firstMatch(in: trimmed, range: NSRange(trimmed.startIndex..., in: trimmed)) {
            if let minutesRange = Range(match.range(at: 1), in: trimmed),
               let secondsRange = Range(match.range(at: 2), in: trimmed),
               let minutes = Int(trimmed[minutesRange]),
               let seconds = Int(trimmed[secondsRange]),
               minutes <= 12, seconds >= 0, seconds < 60 {
                return Double(minutes) * 60 + Double(seconds)
            }
            // If minutes > 12 or seconds >= 60, fall through to decimal parsing
            if let minutes = Int(trimmed[Range(match.range(at: 1), in: trimmed)!]),
               let seconds = Int(trimmed[Range(match.range(at: 2), in: trimmed)!]),
               minutes <= 12, seconds >= 60 {
                return nil // Invalid MM.SS format
            }
        }
        
        // Try as total seconds (including decimals like 208.5)
        if let seconds = Double(trimmed), seconds > 0 {
            return seconds
        }
        
        return nil
    }
    
    /// Validate time input and return error if invalid
    static func validateTimeInput(_ input: String, distance: Int) -> CSSError? {
        let trimmed = input.trimmingCharacters(in: .whitespaces)
        
        guard !trimmed.isEmpty else { return nil }
        
        // Check for invalid seconds >= 60 in various formats
        if trimmed.contains(":") {
            let parts = trimmed.split(separator: ":")
            if parts.count == 2, let seconds = Double(parts[1]), seconds >= 60 {
                return .secondsMustBeLessThan60
            }
        }
        
        if trimmed.contains(" ") {
            let parts = trimmed.split(whereSeparator: { $0.isWhitespace })
            if parts.count == 2, let seconds = Double(parts[1]), seconds >= 60 {
                return .secondsMustBeLessThan60
            }
        }
        
        let periodPattern = #"^(\d+)\.(\d{2})$"#
        if let regex = try? NSRegularExpression(pattern: periodPattern),
           let match = regex.firstMatch(in: trimmed, range: NSRange(trimmed.startIndex..., in: trimmed)),
           let minutesRange = Range(match.range(at: 1), in: trimmed),
           let secondsRange = Range(match.range(at: 2), in: trimmed),
           let minutes = Int(trimmed[minutesRange]),
           let seconds = Int(trimmed[secondsRange]),
           minutes <= 12, seconds >= 60 {
            return .secondsMustBeLessThan60
        }
        
        guard let time = parseTimeInput(trimmed) else {
            return .invalidInput
        }
        
        // Check range limits
        if distance == 200 {
            if time < CSSConstants.time200.min { return .time200TooFast }
            if time > CSSConstants.time200.max { return .time200TooSlow }
        } else if distance == 400 {
            if time < CSSConstants.time400.min { return .time400TooFast }
            if time > CSSConstants.time400.max { return .time400TooSlow }
        }
        
        return nil
    }
    
    /// Format seconds to MM:SS or MM:SS.s
    static func formatTime(_ seconds: Double, includeDecimals: Bool = false) -> String {
        guard !seconds.isNaN else { return "-" }
        
        let mins = Int(seconds) / 60
        let secs = seconds.truncatingRemainder(dividingBy: 60)
        
        if includeDecimals && secs.truncatingRemainder(dividingBy: 1) != 0 {
            let wholeSeconds = Int(secs)
            let tenths = Int(round((secs - Double(wholeSeconds)) * 10))
            return String(format: "%d:%02d.%d", mins, wholeSeconds, tenths)
        } else {
            return String(format: "%d:%02d", mins, Int(round(secs)))
        }
    }
    
    /// Calculate CSS and paces
    static func calculateCSS(time200: Double, time400: Double) throws -> CSSResult {
        guard time200 > 0, time400 > 0 else {
            throw CSSError.timesMustBePositive
        }
        
        guard time200 >= CSSConstants.time200.min else {
            throw CSSError.time200TooFast
        }
        
        guard time200 <= CSSConstants.time200.max else {
            throw CSSError.time200TooSlow
        }
        
        guard time400 >= CSSConstants.time400.min else {
            throw CSSError.time400TooFast
        }
        
        guard time400 <= CSSConstants.time400.max else {
            throw CSSError.time400TooSlow
        }
        
        guard time400 > time200 else {
            throw CSSError.time400MustBeGreater
        }
        
        let pace200 = time200 / 2
        let pace400 = time400 / 4
        
        guard pace400 >= pace200 else {
            throw CSSError.pace400CannotBeFaster
        }
        
        let css = (time400 - time200) / 2
        
        return CSSResult(css: css, pace200: pace200, pace400: pace400)
    }
}
