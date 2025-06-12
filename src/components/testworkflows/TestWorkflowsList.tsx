import { SectionBox, SectionFilterHeader } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import React from 'react';
import { NotSupported } from '../../checktestkube';
import Table from '../common/Table';
import { TestKubeLink } from '../helpers';
import { testWorkflowsClass } from './index';

export function TestWorkflowsList() {
  const filterFunction = useFilterFunc();
  const [resources, setResources] = React.useState(null);
  const [error, setError] = React.useState(null);

  testWorkflowsClass().useApiList(setResources, setError);

  if (error?.status === 404) {
    return <NotSupported typeName="Test Workflows" />;
  }

  return (
    <>
      <SectionBox title={<SectionFilterHeader title="Test Workflows" />}>
        <Table
          data={resources}
          // @ts-ignore -- TODO Update the sorting param
          defaultSortingColumn={2}
          columns={[TestKubeLink(testWorkflowsClass()), 'namespace', 'age']}
          filterFunction={filterFunction}
        />
      </SectionBox>
    </>
  );
}
