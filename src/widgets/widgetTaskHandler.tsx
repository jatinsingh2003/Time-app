import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { YearWidget } from './YearWidget';
import { getYearProgress } from '../utils/dateUtils';

export async function widgetTaskHandler(props: any) {
    const widgetInfo = props.widgetInfo;

    const { daysRemaining, totalDays } = getYearProgress();

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            props.renderWidget(
                <YearWidget daysRemaining={daysRemaining} totalDays={totalDays} />
            );
            break;
        default:
            break;
    }
}

import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
    registerWidgetTaskHandler(widgetTaskHandler);
}
