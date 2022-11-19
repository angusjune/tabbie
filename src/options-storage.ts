import OptionsSync from 'webext-options-sync';

export interface Options {
    theme: 'auto' | 'light' | 'dark';
    iconColor: 'auto' | 'light' | 'dark';
    itemLimit: number;
    showSearch: boolean;
    showLastModified: boolean;
    useNativeScrollbar: boolean;
}


export const defaults: Options = {
    theme: 'auto',
    iconColor: 'auto',
    itemLimit: 10,
    showSearch: false,
    showLastModified: true,
    useNativeScrollbar: false,
}

export const optionsSync = new OptionsSync({
    defaults: { ...defaults },
    migrations: [
        (savedOptions: any) => {
            if (savedOptions.darkMode) {
                savedOptions.theme = savedOptions.darkMode;
                savedOptions.iconColor = savedOptions.darkMode;
				delete savedOptions.darkMode;
            }
        },
        OptionsSync.migrations.removeUnused
    ],
    logging: false,
});

export interface Themes {
    icon: 'light' | 'dark'
}

export const defaultThemes: Themes = {
    icon: 'light'
}

export const themesLocal = new OptionsSync({
    defaults: { ...defaultThemes },
    storageName: 'themes',
    storageType: 'local',
    logging: false,
});