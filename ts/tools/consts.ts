import * as config from 'config';

export const viewPath = './public/views/';
export const ejsSuffix = '.ejs';

export const SALESREGION: number = config.get('SALESREGION');
export const CHINESE: number = config.get('CHINESE');