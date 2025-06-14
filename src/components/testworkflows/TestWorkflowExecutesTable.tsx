import { ActionButton, SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import React from 'react';
import { GetTestkubeWorkflowExecutes } from '../../services/TestkubeProxyAPI';
import Table from '../common/Table';

interface TestkubeWorkflowExecutesTableProps {
  testkubeWorkflowName: string;
}

export function TestWorkflowExecutesTable(props: TestkubeWorkflowExecutesTableProps) {
  const { testkubeWorkflowName } = props;
  const [executes, setExecutes] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    (async () => {
      const response = await GetTestkubeWorkflowExecutes({ name: testkubeWorkflowName });
      setExecutes(response?.results);
    })();
  }, [props]);

  return (
    <SectionBox title="Executes">
      <Table
        data={executes}
        columns={[
          {
            header: 'ID',
            accessorFn: item => item.id,
          },
          {
            header: 'NAME',
            accessorFn: item => item.name,
          },
          {
            header: 'STATUS',
            accessorFn: item => item.result.status,
          },
          {
            header: 'DURATION',
            accessorFn: item => item.result.duration,
          },
          {
            header: 'Archive',
            Cell: ({ row: { original: item } }) => (
              <>
                {item.result.status !== 'running' && (
                  <ActionButton
                    description={'Download Archive'}
                    icon={'mdi:download'}
                    onClick={async (): Promise<void> => {
                      console.info('downloading archive for execute', item.id);
                    }}
                  />
                )}
              </>
            ),
          },
        ]}
      />
    </SectionBox>
  );
}
