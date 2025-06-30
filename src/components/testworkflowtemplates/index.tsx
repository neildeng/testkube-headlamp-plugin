import {
  ConditionsTable,
  MainInfoSection,
  SectionBox,
  SectionFilterHeader,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { makeCustomResourceClass } from '@kinvolk/headlamp-plugin/lib/K8s/crd';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import React from 'react';
import { useParams } from 'react-router-dom';
import { NotSupported } from '../../checktestkube';
import Table from '../common/Table';
import { ObjectEvents, TestKubeLink } from '../helpers';

export function testWorkflowTemplatesClass() {
  return makeCustomResourceClass({
    apiInfo: [{ group: 'testworkflows.testkube.io', version: 'v1' }],
    isNamespaced: true,
    singularName: 'testworkflowtemplate',
    pluralName: 'testworkflowtemplates',
  });
}

export function TestWorkflowTemplatesList() {
  const filterFunction = useFilterFunc();
  const [resources, setResources] = React.useState(null);
  const [error, setError] = React.useState(null);

  testWorkflowTemplatesClass().useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Testkube" />;
  }

  return (
    <>
      <SectionBox title={<SectionFilterHeader title="TestWorkflow Templates" />}>
        <Table
          data={resources}
          // @ts-ignore -- TODO Update the sorting param
          defaultSortingColumn={2}
          columns={[TestKubeLink(testWorkflowTemplatesClass()), 'namespace', 'age']}
          filterFunction={filterFunction}
        />
      </SectionBox>
    </>
  );
}

export function TestWorkflowTemplatesDetailViewer(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;

  return (
    <>
      <CustomResourceDetails name={name} namespace={namespace} />
      <ObjectEvents
        name={name}
        namespace={namespace}
        resourceClass={testWorkflowTemplatesClass()}
      />
    </>
  );
}

function CustomResourceDetails(props) {
  const { name, namespace } = props;
  const [cr, setCr] = React.useState(null);

  testWorkflowTemplatesClass().useApiGet(setCr, name, namespace);

  function prepareExtraInfo(cr) {
    if (!cr) {
      return [];
    }

    const extraInfo = [];

    return extraInfo;
  }

  function prepareActions() {
    const actions = [];
    return actions;
  }

  return (
    <>
      {cr && (
        <MainInfoSection
          resource={cr}
          extraInfo={prepareExtraInfo(cr)}
          actions={prepareActions()}
        />
      )}
      <SectionBox title="Conditions">
        <ConditionsTable resource={cr?.jsonData} />
      </SectionBox>
    </>
  );
}
