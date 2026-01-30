import SwiftUI

struct CalculatorView: View {
    @State private var time200Input = ""
    @State private var time400Input = ""
    @State private var error200: String?
    @State private var error400: String?
    @State private var cssResult: CSSResult?
    @State private var mainError: String?
    
    @FocusState private var focusedField: Field?
    
    enum Field {
        case time200, time400
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // 200m Input
                    TrialInputView(
                        title: "200m Time",
                        placeholder: "e.g., 3:28 or 208.5",
                        input: $time200Input,
                        error: error200,
                        breakdown: time200Breakdown,
                        isFocused: focusedField == .time200
                    )
                    .focused($focusedField, equals: .time200)
                    .onChange(of: time200Input) { _ in
                        validateAndCalculate()
                    }
                    
                    // 400m Input
                    TrialInputView(
                        title: "400m Time",
                        placeholder: "e.g., 7:20 or 440.5",
                        input: $time400Input,
                        error: error400,
                        breakdown: time400Breakdown,
                        isFocused: focusedField == .time400
                    )
                    .focused($focusedField, equals: .time400)
                    .onChange(of: time400Input) { _ in
                        validateAndCalculate()
                    }
                    
                    // Main Error
                    if let error = mainError {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.subheadline)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(8)
                    }
                    
                    // CSS Result
                    if let result = cssResult {
                        CSSResultView(css: result.css)
                    }
                    
                    // Reset Button
                    Button(action: reset) {
                        Text("Start Again")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.gray)
                            .cornerRadius(10)
                    }
                    .padding(.top, 16)
                    
                    Spacer()
                }
                .padding()
            }
            .navigationTitle("CSS Calculator")
            .onTapGesture {
                focusedField = nil
            }
        }
    }
    
    private var time200Breakdown: TrialBreakdown? {
        guard let time = CSSCalculator.parseTimeInput(time200Input),
              error200 == nil else { return nil }
        return TrialBreakdown(
            seconds: time,
            minSec: CSSCalculator.formatTime(time, includeDecimals: true),
            pace: CSSCalculator.formatTime(time / 2, includeDecimals: true)
        )
    }
    
    private var time400Breakdown: TrialBreakdown? {
        guard let time = CSSCalculator.parseTimeInput(time400Input),
              error400 == nil else { return nil }
        return TrialBreakdown(
            seconds: time,
            minSec: CSSCalculator.formatTime(time, includeDecimals: true),
            pace: CSSCalculator.formatTime(time / 4, includeDecimals: true)
        )
    }
    
    private func validateAndCalculate() {
        // Validate 200m
        if let error = CSSCalculator.validateTimeInput(time200Input, distance: 200) {
            error200 = error.localizedDescription
        } else {
            error200 = nil
        }
        
        // Validate 400m
        if let error = CSSCalculator.validateTimeInput(time400Input, distance: 400) {
            error400 = error.localizedDescription
        } else {
            error400 = nil
        }
        
        // Clear main error and result if validation errors exist
        if error200 != nil || error400 != nil {
            mainError = nil
            cssResult = nil
            return
        }
        
        // Try to calculate CSS
        guard let time200 = CSSCalculator.parseTimeInput(time200Input),
              let time400 = CSSCalculator.parseTimeInput(time400Input) else {
            mainError = nil
            cssResult = nil
            return
        }
        
        do {
            cssResult = try CSSCalculator.calculateCSS(time200: time200, time400: time400)
            mainError = nil
        } catch {
            cssResult = nil
            mainError = error.localizedDescription
        }
    }
    
    private func reset() {
        time200Input = ""
        time400Input = ""
        error200 = nil
        error400 = nil
        cssResult = nil
        mainError = nil
        focusedField = nil
    }
}

struct TrialBreakdown {
    let seconds: Double
    let minSec: String
    let pace: String
}

struct TrialInputView: View {
    let title: String
    let placeholder: String
    @Binding var input: String
    let error: String?
    let breakdown: TrialBreakdown?
    let isFocused: Bool
    
    var body: some View {
        VStack(alignment: .center, spacing: 8) {
            Text(title)
                .font(.headline)
            
            TextField(placeholder, text: $input)
                .keyboardType(.numbersAndPunctuation)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .multilineTextAlignment(.center)
                .onChange(of: input) { newValue in
                    // Filter to only allow valid characters
                    let filtered = newValue.filter { "0123456789:. ".contains($0) }
                    if filtered != newValue {
                        input = filtered
                    }
                }
            
            Text("MM:SS(.s) or SSS(.s)")
                .font(.caption)
                .foregroundColor(.gray)
            
            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
            
            if let breakdown = breakdown {
                HStack(spacing: 16) {
                    VStack {
                        Text(breakdown.seconds.truncatingRemainder(dividingBy: 1) != 0 
                             ? String(format: "%.1f", breakdown.seconds) 
                             : String(format: "%.0f", breakdown.seconds))
                            .font(.subheadline.bold())
                        Text("sec")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    VStack {
                        Text(breakdown.minSec)
                            .font(.subheadline.bold())
                        Text("min:sec")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    VStack {
                        Text("\(breakdown.pace)/100")
                            .font(.subheadline.bold())
                        Text("pace")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
                .padding()
                .background(Color.blue.opacity(0.1))
                .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct CSSResultView: View {
    let css: Double
    
    var body: some View {
        VStack(spacing: 8) {
            Text("Critical Swim Speed (CSS)")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            Text(CSSCalculator.formatTime(css, includeDecimals: true))
                .font(.system(size: 48, weight: .bold))
                .foregroundColor(.blue)
            
            Text("per 100m")
                .font(.subheadline)
                .foregroundColor(.gray)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color.blue.opacity(0.1))
        .cornerRadius(12)
    }
}

#Preview {
    CalculatorView()
}
