import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function YearWidget({ daysRemaining, totalDays }: { daysRemaining: number; totalDays: number }) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#ffffff',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
                borderRadius: 16,
            }}
        >
            <TextWidget
                text={`${daysRemaining}`}
                style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#000000',
                }}
            />
            <TextWidget
                text="DAYS LEFT"
                style={{
                    fontSize: 12,
                    color: '#666666',
                    letterSpacing: 2,
                }}
            />

            <FlexWidget
                style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                {/* Simplified grid for widget representation */}
                {/* We can't render 365 views efficiently in a widget maybe? 
           react-native-android-widget renders to bitmap, so it might be okay.
           But let's keep it simple: Progress Bar or minimalistic text first.
        */}
                <FlexWidget
                    style={{
                        height: 4,
                        width: '100%',
                        backgroundColor: '#eeeeee',
                        borderRadius: 2,
                        marginTop: 8
                    }}
                >
                    <FlexWidget
                        style={{
                            height: 4,
                            width: `${((totalDays - daysRemaining) / totalDays) * 100}%`,
                            backgroundColor: '#000000',
                            borderRadius: 2
                        }}
                    />
                </FlexWidget>
            </FlexWidget>
        </FlexWidget>
    );
}
