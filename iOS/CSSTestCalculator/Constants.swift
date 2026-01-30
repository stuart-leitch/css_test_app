import Foundation

struct CSSConstants {
    struct TimeLimits {
        let min: Double
        let max: Double
    }
    
    static let time200 = TimeLimits(min: 100, max: 360)  // 1:40 - 6:00
    static let time400 = TimeLimits(min: 210, max: 720)  // 3:30 - 12:00
}
