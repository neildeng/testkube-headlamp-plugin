import {
  ConditionsTable,
  SectionBox,
  MainInfoSection,
  SectionFilterHeader,
  NameValueTable,
} from "@kinvolk/headlamp-plugin/lib/CommonComponents";
import Table from '../common/Table';
import {useFilterFunc} from '@kinvolk/headlamp-plugin/lib/Utils';
import React from 'react';
import {RunAction} from '../actions';
import {NotSupported} from '../../checktestkube';
import {makeCustomResourceClass} from '@kinvolk/headlamp-plugin/lib/lib/k8s/crd';
import {TestKubeLink, ObjectEvents} from '../helpers';
import {useParams} from 'react-router-dom';
import {TestkubeWorkflowExecutesTable} from "./TestkubeWorkflowExecutesTable";

export function testWorkflowsClass() {
  return makeCustomResourceClass({
    apiInfo: [{group: 'testworkflows.testkube.io', version: 'v1'}],
    isNamespaced: true,
    singularName: 'testworkflow',
    pluralName: 'testworkflows',
  });
}

export function TestWorkflowsList() {
  const filterFunction = useFilterFunc();
  const [resources, setResources] = React.useState(null);
  const [error, setError] = React.useState(null);

  testWorkflowsClass().useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Test Workflows"/>;
  }

  return (
    <>
      <SectionBox title={<SectionFilterHeader title="Test Workflows"/>}>
        <Table
          data={resources}
          // @ts-ignore -- TODO Update the sorting param
          defaultSortingColumn={2}
          columns={[
            TestKubeLink(testWorkflowsClass()),
            'namespace',
            'age',
          ]}
          filterFunction={filterFunction}
        />
      </SectionBox>
    </>
  );
}

export function TestWorkflowDetailViewer(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const {name = params.name, namespace = params.namespace} = props;

  return (
    <>
      <CustomResourceDetails name={name} namespace={namespace}/>
      <ObjectEvents name={name} namespace={namespace} resourceClass={testWorkflowsClass()}/>
    </>
  );
}

function CustomResourceDetails(props: any) {
  const {name, namespace} = props;
  const [cr, setCr] = React.useState(null);

  testWorkflowsClass().useApiGet(setCr, name, namespace);

  function prepareExtraInfo(cr: any) {
    if (!cr) {
      return [];
    }

    return [
      {
        name: 'Working Directory',
        value: cr?.jsonData?.spec.container?.workingDir,
      },
    ];
  }

  function prepareActions() {
    const actions = [];
    actions.push(<RunAction resource={cr}/>);
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
      {cr?.jsonData?.spec?.content?.git && <GitRepositoryTable git={cr?.jsonData?.spec?.content?.git}/>}
      {cr?.jsonData?.spec?.steps && <StepsTable steps={cr?.jsonData?.spec?.steps}/>}
      <TestkubeWorkflowExecutesTable testkubeWorkflowName={props.name}/>
      <SectionBox title="Conditions">
        <ConditionsTable resource={cr?.jsonData}/>
      </SectionBox>
    </>
  );
}

function GitRepositoryTable(props: any) {
  const {git} = props;
  return (
    <SectionBox title="Context From Git">
      <NameValueTable
        rows={[
          {
            name: 'Uri',
            value: git.uri,
          },
          {
            name: 'Revision',
            value: git.revision,
          },
          {
            name: 'Paths',
            value: git.paths,
          },
        ]}
      />
    </SectionBox>
  );
}

function StepsTable(props: any) {
  const {steps} = props;
  return (
    <SectionBox title="Steps">
      <Table
        data={steps}
        columns={[
          {
            header: 'Name',
            accessorFn: item => (item.name),
          },
          {
            header: 'Container',
            accessorFn: item => (item.container.image),
          },
          {
            header: 'Shell',
            accessorFn: item => (item.shell),
          },
          {
            header: 'Artifacts',
            accessorFn: item => (item.artifacts.paths),
          },
        ]}
      />
    </SectionBox>
  );
}


