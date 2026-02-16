import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), daysLeft: 100, totalDays: 365)
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), daysLeft: 100, totalDays: 365)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Fetch shared data from App Group (UserDefaults)
        let userDefaults = UserDefaults(suiteName: "group.com.antigravity.timeapp")
        let daysLeft = userDefaults?.integer(forKey: "daysLeft") ?? 0
        let totalDays = userDefaults?.integer(forKey: "totalDays") ?? 365
        
        // Refresh policy: once per day or every few hours
        let currentDate = Date()
        let nextUpdateDate = Calendar.current.date(byAdding: .hour, value: 4, to: currentDate)!
        
        let entry = SimpleEntry(date: currentDate, daysLeft: daysLeft, totalDays: totalDays)
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdateDate))
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let daysLeft: Int
    let totalDays: Int
}

struct TimeWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack {
            Text("\(entry.daysLeft)")
                .font(.system(size: 40, weight: .black))
                .foregroundColor(.black)
            Text("DAYS LEFT")
                .font(.caption)
                .tracking(2)
                .foregroundColor(.gray)
            
            // Minimal progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .frame(width: geometry.size.width, height: 4)
                        .opacity(0.3)
                        .foregroundColor(.gray)
                    
                    Rectangle()
                        .frame(width: min(CGFloat(Float(entry.totalDays - entry.daysLeft) / Float(entry.totalDays)) * geometry.size.width, geometry.size.width), height: 4)
                        .foregroundColor(.black)
                }
            }
            .frame(height: 4)
            .padding(.top, 5)
        }
        .padding()
        .background(Color.white)
    }
}

@main
struct TimeWidget: Widget {
    let kind: String = "TimeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TimeWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Year Progress")
        .description("Shows remaining days of the year.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
