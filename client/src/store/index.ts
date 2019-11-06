import { request, storage } from 'c0nfig';
import createStore from './createStore';
import {
    ServiceManager, AudioService, AuthService, CameraService, FileService,
    ModelService, RemoteService, StorageService, DictionaryService, HttpClient,
} from '../services';

const httpClient = new HttpClient(request);
const audioService = new AudioService({});
const authService = new AuthService({ httpClient });
const dictService = new DictionaryService({ httpClient });
const fileService = new FileService({ version: storage.version });
const modelService = new ModelService({ httpClient });
const remoteService = new RemoteService({ httpClient });
const cameraService = new CameraService({});
const storageService = new StorageService({ version: storage.version });

ServiceManager.register(audioService);
ServiceManager.register(authService);
ServiceManager.register(cameraService);
ServiceManager.register(fileService);
ServiceManager.register(storageService);
ServiceManager.register(modelService);
ServiceManager.register(remoteService);
ServiceManager.register(dictService);

const store = createStore();

export default store;