import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            CalculatorView()
                .tabItem {
                    Image(systemName: "function")
                    Text("Calculator")
                }
                .tag(0)
            
            TimerView()
                .tabItem {
                    Image(systemName: "stopwatch")
                    Text("Timer")
                }
                .tag(1)
        }
        .accentColor(.blue)
    }
}

#Preview {
    ContentView()
}
