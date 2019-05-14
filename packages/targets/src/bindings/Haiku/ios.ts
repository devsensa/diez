import {Haiku} from '@diez/prefabs';
import {join} from 'path';
import {haikuAssetBinder} from '../../asset-binders/haiku';
import {IosBinding} from '../../targets/ios.api';
import {sourcesPath} from '../../utils';

const binding: IosBinding<Haiku> = {
  sources: [
    join(sourcesPath, 'ios', 'bindings', 'Bundle+File.swift'),
    join(sourcesPath, 'ios', 'bindings', 'File.swift'),
    join(sourcesPath, 'ios', 'bindings', 'Haiku.swift'),
    join(sourcesPath, 'ios', 'bindings', 'HaikuView.swift'),
  ],
  imports: ['UIKit.UIView', 'WebKit'],
  assetsBinder: haikuAssetBinder,
};

export = binding;
