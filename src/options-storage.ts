import OptionsStorage from './options-storage-wrapper';
import type { StorageValues } from './options-storage-wrapper';

export interface Options extends StorageValues {
    theme: 'auto' | 'light' | 'dark';
    iconColor: 'auto' | 'light' | 'dark';
    itemLimit: number;
    showSearch: boolean;
    showLastModified: boolean;
    useNativeScrollbar: boolean;
    quickUndoLastClosedTab: boolean;
}


export const defaults: Options = {
    theme: 'auto',
    iconColor: 'auto',
    itemLimit: 10,
    showSearch: false,
    showLastModified: true,
    useNativeScrollbar: false,
    quickUndoLastClosedTab: false,
}

export const optionsSync = new OptionsStorage<Options>({
    defaults: { ...defaults },
    migrations: [
        (savedOptions: any) => {
            if (savedOptions.darkMode) {
                savedOptions.theme = savedOptions.darkMode;
                savedOptions.iconColor = savedOptions.darkMode;
				delete savedOptions.darkMode;
            }
        },
        OptionsStorage.migrations.removeUnused
    ],
});

export interface Themes extends StorageValues {
    icon: 'light' | 'dark'
}

export const defaultThemes: Themes = {
    icon: 'light'
}

export const themesLocal = new OptionsStorage<Themes>({
    defaults: { ...defaultThemes },
    storageName: 'themes',
    storageType: 'local',
});
