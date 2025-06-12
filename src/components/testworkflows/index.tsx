import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/K8s/crd';

export function testWorkflowsClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: 'testworkflows.testkube.io', version: 'v1' }],
    isNamespaced: true,
    singularName: 'testworkflow',
    pluralName: 'testworkflows',
  });
}
