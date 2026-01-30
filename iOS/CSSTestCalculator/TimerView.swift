import SwiftUI

struct TimerView: View {
    @StateObject private var timerManager = TimerManager()
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // 200m Timer
                    TimerTrialView(
                        title: "200m Trial",
                        elapsed: timerManager.elapsed200,
                        isRunning: timerManager.isRunning200,
                        result: timerManager.result200,
                        onStart: { timerManager.start200() },
                        onStop: { timerManager.stop200() },
                        isEnabled: !timerManager.isRunning400 && timerManager.result200 == nil
                    )
                    
                    // 400m Timer (only show after 200m complete)
                    if timerManager.result200 != nil {
                        TimerTrialView(
                            title: "400m Trial",
                            elapsed: timerManager.elapsed400,
                            isRunning: timerManager.isRunning400,
                            result: timerManager.result400,
                            onStart: { timerManager.start400() },
                            onStop: { timerManager.stop400() },
                            isEnabled: !timerManager.isRunning200 && timerManager.result400 == nil
                        )
                    }
                    
                    // Error message
                    if let error = timerManager.error {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.subheadline)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(8)
                    }
                    
                    // CSS Result
                    if let css = timerManager.cssResult {
                        CSSResultView(css: css)
                    }
                    
                    // Reset Button
                    Button(action: { timerManager.reset() }) {
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
            .navigationTitle("CSS Timer")
        }
    }
}

struct TimerTrialView: View {
    let title: String
    let elapsed: TimeInterval
    let isRunning: Bool
    let result: TimeInterval?
    let onStart: () -> Void
    let onStop: () -> Void
    let isEnabled: Bool
    
    var body: some View {
        VStack(spacing: 16) {
            Text(title)
                .font(.headline)
            
            // Timer display
            Text(formatElapsed(result ?? elapsed))
                .font(.system(size: 48, weight: .bold, design: .monospaced))
                .foregroundColor(isRunning ? .blue : .primary)
            
            // Start/Stop button
            if result == nil {
                Button(action: isRunning ? onStop : onStart) {
                    Text(isRunning ? "Stop" : "Start")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(width: 120, height: 44)
                        .background(isRunning ? Color.red : Color.green)
                        .cornerRadius(22)
                }
                .disabled(!isEnabled && !isRunning)
                .opacity((!isEnabled && !isRunning) ? 0.5 : 1)
            }
            
            // Breakdown (after stopped)
            if let time = result {
                let pace = time / (title.contains("200") ? 2 : 4)
                HStack(spacing: 16) {
                    VStack {
                        Text(String(format: "%.1f", time))
                            .font(.subheadline.bold())
                        Text("sec")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    VStack {
                        Text(CSSCalculator.formatTime(time, includeDecimals: true))
                            .font(.subheadline.bold())
                        Text("min:sec")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    
                    VStack {
                        Text("\(CSSCalculator.formatTime(pace, includeDecimals: true))/100")
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
    
    private func formatElapsed(_ interval: TimeInterval) -> String {
        let minutes = Int(interval) / 60
        let seconds = interval.truncatingRemainder(dividingBy: 60)
        return String(format: "%d:%04.1f", minutes, seconds)
    }
}

class TimerManager: ObservableObject {
    @Published var elapsed200: TimeInterval = 0
    @Published var elapsed400: TimeInterval = 0
    @Published var isRunning200 = false
    @Published var isRunning400 = false
    @Published var result200: TimeInterval?
    @Published var result400: TimeInterval?
    @Published var cssResult: Double?
    @Published var error: String?
    
    private var timer200: Timer?
    private var timer400: Timer?
    private var startTime200: Date?
    private var startTime400: Date?
    
    func start200() {
        startTime200 = Date()
        isRunning200 = true
        timer200 = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self, let start = self.startTime200 else { return }
            self.elapsed200 = Date().timeIntervalSince(start)
        }
    }
    
    func stop200() {
        timer200?.invalidate()
        timer200 = nil
        isRunning200 = false
        result200 = elapsed200
        calculateCSSIfReady()
    }
    
    func start400() {
        startTime400 = Date()
        isRunning400 = true
        timer400 = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self, let start = self.startTime400 else { return }
            self.elapsed400 = Date().timeIntervalSince(start)
        }
    }
    
    func stop400() {
        timer400?.invalidate()
        timer400 = nil
        isRunning400 = false
        result400 = elapsed400
        calculateCSSIfReady()
    }
    
    func reset() {
        timer200?.invalidate()
        timer400?.invalidate()
        timer200 = nil
        timer400 = nil
        
        elapsed200 = 0
        elapsed400 = 0
        isRunning200 = false
        isRunning400 = false
        result200 = nil
        result400 = nil
        cssResult = nil
        error = nil
        startTime200 = nil
        startTime400 = nil
    }
    
    private func calculateCSSIfReady() {
        guard let time200 = result200, let time400 = result400 else { return }
        
        do {
            let result = try CSSCalculator.calculateCSS(
                time200: time200,
                time400: time400
            )
            cssResult = result.css
            error = nil
        } catch {
            cssResult = nil
            self.error = error.localizedDescription
        }
    }
}

#Preview {
    TimerView()
}
