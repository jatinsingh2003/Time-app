import React from 'react';
import { NativeModules, Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';

import type { AppConfig } from '../storage/storage';
import { YearWidget } from './YearWidget';
import { buildWidgetPayload, type WidgetPayload } from './sharedWidgetModel';

type IOSWidgetBridge = {
    syncWidgetData?: (payload: string) => Promise<void> | void;
    reloadWidgets?: () => Promise<void> | void;
    openWidgetInstructions?: () => Promise<void> | void;
};

const widgetBridge: IOSWidgetBridge | undefined =
    NativeModules.DotChronoWidgetBridge ??
    NativeModules.IOSWidgetBridge ??
    NativeModules.TimeWidgetModule;

export async function syncWidgets(config: AppConfig): Promise<WidgetPayload> {
    const payload = buildWidgetPayload(config);

    if (Platform.OS === 'android') {
        await requestWidgetUpdate({
            widgetName: 'YearProgress',
            renderWidget: () => <YearWidget model={payload.model} />,
        });
    }

    if (Platform.OS === 'ios' && widgetBridge?.syncWidgetData) {
        await Promise.resolve(widgetBridge.syncWidgetData(JSON.stringify(payload)));
        if (widgetBridge.reloadWidgets) {
            await Promise.resolve(widgetBridge.reloadWidgets());
        }
    }

    return payload;
}

export async function openIOSWidgetInstructions() {
    if (Platform.OS === 'ios' && widgetBridge?.openWidgetInstructions) {
        await Promise.resolve(widgetBridge.openWidgetInstructions());
        return true;
    }

    return false;
}
