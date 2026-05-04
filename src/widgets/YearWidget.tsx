import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { WidgetDotTone, WidgetModel } from './sharedWidgetModel';

function getDotColor(tone: WidgetDotTone) {
    switch (tone) {
        case 'goal':
            return '#FF3B30';
        case 'today':
            return '#FF9500';
        case 'past':
            return '#111111';
        default:
            return '#DADADA';
    }
}

function getDotSize(totalDots: number) {
    if (totalDots > 250) return 5;
    if (totalDots > 120) return 7;
    return 9;
}

function trimTitle(title: string) {
    if (title.length <= 22) return title;
    return `${title.slice(0, 19)}...`;
}

function buildRows<T>(items: T[], rowLength: number) {
    const rows: T[][] = [];

    for (let index = 0; index < items.length; index += rowLength) {
        rows.push(items.slice(index, index + rowLength));
    }

    return rows;
}

export function YearWidget({ model }: { model: WidgetModel }) {
    const dotSize = getDotSize(model.totalDots);
    const cellSize = dotSize + 3;
    const rows = buildRows(model.dots, model.columns);

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#FFFFFF',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 14,
                borderRadius: 20,
            }}
        >
            <TextWidget
                text={trimTitle(model.title).toUpperCase()}
                style={{
                    fontSize: 11,
                    color: '#666666',
                    letterSpacing: 1.2,
                    fontWeight: 'bold',
                }}
            />

            <TextWidget
                text={`${model.headlineValue}`}
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: '#000000',
                    marginTop: 4,
                }}
            />

            <TextWidget
                text={model.headlineLabel}
                style={{
                    fontSize: 11,
                    color: '#666666',
                    letterSpacing: 1.2,
                    marginTop: 2,
                }}
            />

            <FlexWidget
                style={{
                    marginTop: 10,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: 'match_parent',
                }}
            >
                {rows.map((row, rowIndex) => (
                    <FlexWidget
                        key={rowIndex}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        {row.map((dot) => (
                            <FlexWidget
                                key={dot.id}
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FlexWidget
                                    style={{
                                        width: dotSize,
                                        height: dotSize,
                                        borderRadius: dotSize / 2,
                                        backgroundColor: getDotColor(dot.tone),
                                    }}
                                />
                            </FlexWidget>
                        ))}
                    </FlexWidget>
                ))}
            </FlexWidget>

            <TextWidget
                text={model.footer}
                style={{
                    fontSize: 10,
                    color: '#FF9500',
                    fontWeight: 'bold',
                    marginTop: 8,
                }}
            />
        </FlexWidget>
    );
}
