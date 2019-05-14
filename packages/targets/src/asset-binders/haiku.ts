import {AssetBinder} from '@diez/compiler';
import {Haiku} from '@diez/prefabs';
import {readFile} from 'fs-extra';
import {compile} from 'handlebars';
import {join} from 'path';
import {templateRoot} from '.';

/**
 * An asset binder for the Haiku prefab.
 *
 * Given a Diez Haiku component instance, registers an asset at `./haiku/<componentName>.html` containing
 * the Haiku component plus an embedded `@haiku/core` runtime.
 *
 * For example, for a component based on the component `@haiku/foo-bar`, a binding at `./haiku/@haiku/foo-bar.html`
 * will be created.
 */
export const haikuAssetBinder: AssetBinder<Haiku> = async (instance, _, {assetBindings}) =>
  new Promise((resolve, reject) => {
    const standaloneIndexPath = require.resolve(instance.component).replace('index.js', 'index.standalone.js');
    readFile(standaloneIndexPath, (standaloneError, standaloneIndexContentBuffer) => {
      if (standaloneError) {
        return reject(standaloneError);
      }

      const standaloneIndexContent = standaloneIndexContentBuffer.toString();
      const matches = standaloneIndexContent.match(/var (\w+)=/);
      if (!matches) {
        return resolve();
      }
      readFile(join(templateRoot, 'haiku.handlebars'), (templateError, templateContentsBuffer) => {
        if (templateError) {
          return reject(templateError);
        }

        assetBindings.set(
          `haiku/${instance.component}.html`,
          {
            contents: compile(templateContentsBuffer.toString())({
              standaloneIndexContent,
              adapterName: matches[1],
              loop: instance.loop,
              autoplay: instance.autoplay,
            }),
          },
        );

        resolve();
      });
    });
  });
