import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { Platform } from 'react-native';

import { getConfig } from '../storage/storage';
import { YearWidget } from './YearWidget';
import { buildWidgetPayload } from './sharedWidgetModel';

export async function widgetTaskHandler(props: any) {
    const config = await getConfig();
    const payload = buildWidgetPayload(config);

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            props.renderWidget(
                <YearWidget model={payload.model} />
            );
            break;
        default:
            break;
    }
}

if (Platform.OS !== 'web') {
    registerWidgetTaskHandler(widgetTaskHandler);
}
