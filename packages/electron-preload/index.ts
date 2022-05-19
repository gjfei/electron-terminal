import electron from 'electron';
import { domReady } from './utils';
import { useLoading } from './loading';
const { appendLoading, removeLoading } = useLoading();
window.removeLoading = removeLoading;
window.electron = electron;
domReady().then(appendLoading);
