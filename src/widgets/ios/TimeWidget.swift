import WidgetKit
import SwiftUI

private let appGroupId = "group.com.spritzstudio.dotchrono"
private let payloadKey = "widgetPayload"

struct DotChronoDot: Codable, Hashable {
    let id: Int
    let tone: String
}

struct DotChronoModel: Codable {
    let mode: String
    let title: String
    let headlineValue: Int
    let headlineLabel: String
    let footer: String
    let percentage: Int
    let totalDots: Int
    let columns: Int
    let dots: [DotChronoDot]
}

struct DotChronoPayload: Codable {
    let version: Int
    let generatedAt: String
    let selectedMode: String
    let goalTitle: String?
    let goalDate: String?
    let goalStartDay: Int?
    let model: DotChronoModel
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let payload: DotChronoPayload
}

enum PayloadStore {
    static func load() -> DotChronoPayload? {
        guard
            let defaults = UserDefaults(suiteName: appGroupId),
            let json = defaults.string(forKey: payloadKey),
            let data = json.data(using: .utf8)
        else {
            return nil
        }

        return try? JSONDecoder().decode(DotChronoPayload.self, from: data)
    }

    static func sampleYear() -> DotChronoPayload {
        let dots = (0..<365).map { index in
            DotChronoDot(id: index, tone: index < 120 ? "past" : (index == 120 ? "today" : "future"))
        }

        return DotChronoPayload(
            version: 1,
            generatedAt: ISO8601DateFormatter().string(from: Date()),
            selectedMode: "year",
            goalTitle: nil,
            goalDate: nil,
            goalStartDay: nil,
            model: DotChronoModel(
                mode: "year",
                title: "Year Progress",
                headlineValue: 245,
                headlineLabel: "DAYS LEFT",
                footer: "245D left · 33%",
                percentage: 33,
                totalDots: 365,
                columns: 15,
                dots: dots
            )
        )
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), payload: PayloadStore.sampleYear())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let payload = PayloadStore.load() ?? PayloadStore.sampleYear()
        completion(SimpleEntry(date: Date(), payload: payload))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let payload = PayloadStore.load() ?? PayloadStore.sampleYear()
        let currentDate = Date()

        let nextMidnight = Calendar.current.nextDate(
            after: currentDate,
            matching: DateComponents(hour: 0, minute: 0, second: 5),
            matchingPolicy: .nextTime
        ) ?? Calendar.current.date(byAdding: .hour, value: 24, to: currentDate)!

        let entry = SimpleEntry(date: currentDate, payload: payload)
        let timeline = Timeline(entries: [entry], policy: .after(nextMidnight))
        completion(timeline)
    }
}

struct DotGridView: View {
    let dots: [DotChronoDot]
    let columns: Int

    private var dotSize: CGFloat {
        if dots.count > 250 { return 5 }
        if dots.count > 120 { return 7 }
        return 9
    }

    private var gridColumns: [GridItem] {
        Array(repeating: GridItem(.fixed(dotSize + 3), spacing: 0), count: max(columns, 1))
    }

    var body: some View {
        LazyVGrid(columns: gridColumns, spacing: 0) {
            ForEach(dots, id: \.id) { dot in
                Circle()
                    .fill(color(for: dot.tone))
                    .frame(width: dotSize, height: dotSize)
                    .frame(width: dotSize + 3, height: dotSize + 3)
            }
        }
        .frame(maxWidth: .infinity)
    }

    private func color(for tone: String) -> Color {
        switch tone {
        case "goal":
            return Color(red: 1.0, green: 0.23, blue: 0.19)
        case "today":
            return Color(red: 1.0, green: 0.58, blue: 0.0)
        case "past":
            return .black
        default:
            return Color(white: 0.85)
        }
    }
}

struct TimeWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) private var family

    private var titleText: String {
        let uppercased = entry.payload.model.title.uppercased()
        return uppercased.count > 24 ? String(uppercased.prefix(21)) + "..." : uppercased
    }

    private var shouldShowTitle: Bool {
        family != .systemSmall || entry.payload.model.mode == "year"
    }

    var body: some View {
        VStack(spacing: 8) {
            if shouldShowTitle {
                Text(titleText)
                    .font(.system(size: 11, weight: .bold))
                    .tracking(1)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
            }

            Text("\(entry.payload.model.headlineValue)")
                .font(.system(size: family == .systemSmall ? 28 : 34, weight: .black))
                .foregroundColor(.black)

            Text(entry.payload.model.headlineLabel)
                .font(.system(size: 11, weight: .semibold))
                .tracking(1)
                .foregroundColor(.gray)

            DotGridView(
                dots: entry.payload.model.dots,
                columns: entry.payload.model.columns
            )

            Text(entry.payload.model.footer)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(Color(red: 1.0, green: 0.58, blue: 0.0))
        }
        .padding(14)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
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
        .configurationDisplayName("DotChrono")
        .description("Shows your year progress or active goal as a dot grid.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
