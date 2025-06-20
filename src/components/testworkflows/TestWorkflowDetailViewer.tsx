import {
  ConditionsTable,
  MainInfoSection,
  NameValueTable,
  SectionBox,
  TileChart,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { GetTestkubeWorkflowExecutes } from '../../services/TestkubeProxyAPI';
import { RunAction } from '../actions';
import Table from '../common/Table';
import { ObjectEvents } from '../helpers';
import { testWorkflowsClass } from './index';
import { TestWorkflowExecutesTable } from './TestWorkflowExecutesTable';

export function TestWorkflowDetailViewer(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;

  return (
    <>
      <CustomResourceDetails name={name} namespace={namespace} />
      <ObjectEvents name={name} namespace={namespace} resourceClass={testWorkflowsClass()} />
    </>
  );
}

function CustomResourceDetails(props: any) {
  const { name, namespace } = props;
  const [cr, setCr] = React.useState(null);
  const [executes, setExecutes] = React.useState(null);

  testWorkflowsClass().useApiGet(setCr, name, namespace);

  React.useEffect(() => {
    (async () => {
      const response = await GetTestkubeWorkflowExecutes({ name: props.name });
      setExecutes(response);
    })();
  }, [cr]);

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
    actions.push(<RunAction resource={cr} />);
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
      {executes && <SummarySection executes={executes} />}
      {cr?.jsonData?.spec?.steps && <StepsTable steps={cr?.jsonData?.spec?.steps} />}
      {cr?.jsonData?.metadata?.name && (
        <TestWorkflowExecutesTable testkubeWorkflowName={cr?.jsonData?.metadata?.name} />
      )}
      {cr?.jsonData?.spec?.content?.git && (
        <GitRepositoryTable git={cr?.jsonData?.spec?.content?.git} />
      )}
      <SectionBox title="Conditions">
        <ConditionsTable resource={cr?.jsonData} />
      </SectionBox>
    </>
  );
}

function GitRepositoryTable(props: any) {
  const { git } = props;
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
  const { steps } = props;
  return (
    <SectionBox title="Steps">
      <Table
        data={steps}
        columns={[
          {
            header: 'Name',
            accessorFn: item => item.name,
          },
          {
            header: 'Container',
            accessorFn: item => item.container.image,
          },
          {
            header: 'Shell',
            accessorFn: item => item.shell,
          },
          {
            header: 'Artifacts',
            accessorFn: item => item.artifacts.paths,
          },
        ]}
      />
    </SectionBox>
  );
}

function SummarySection(props: any) {
  const { executes } = props;
  return (
    <SectionBox title="Overview">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          flexWrap: 'wrap',
        }}
      >
        <Box width="300px" sx={{ mt: 6 }}>
          <TestWorkflowsPassFailRatioChart totals={executes.totals} />
        </Box>
        <Box width="300px" sx={{ mt: 6 }}>
          <TestWorkflowsRunningQueuedChart totals={executes.totals} />
        </Box>
      </Box>
    </SectionBox>
  );
}

function TestWorkflowsPassFailRatioChart(data: { totals: any }) {
  const { totals } = data;

  const [total, passed, failed] = [totals.results, totals.passed, totals.failed];
  const [running, queued] = [totals.running, totals.queued];

  function makeData() {
    // Calculate actual percentages
    // Use Math.round to ensure whole numbers
    const successPercent = total > 0 ? Math.round((passed / total) * 100) : 0;
    const failedPercent = total > 0 ? Math.round((failed / total) * 100) : 0;
    const runningPercent = total > 0 ? Math.round((running / total) * 100) : 0;
    const queuedPercent = total > 0 ? Math.round((queued / total) * 100) : 0;

    // Ensure percentages add up to 100%
    let adjustedSuccessPercent = successPercent;
    let adjustedFailedPercent = failedPercent;
    const adjustedRunningPercent = runningPercent;
    const adjustedQueuedPercent = queuedPercent;

    const sum = successPercent + failedPercent;
    if (sum !== 100 && total > 0) {
      const diff = 100 - sum;
      // Add the difference to the largest segment
      if (successPercent >= failedPercent) {
        adjustedSuccessPercent += diff;
      } else {
        adjustedFailedPercent += diff;
      }
    }

    return [
      {
        name: 'success',
        value: adjustedSuccessPercent,
        fill: '#00FF00', // Green for success
      },
      {
        name: 'failed',
        value: adjustedFailedPercent,
        fill: '#DC0000', // Red for failed
      },
      {
        name: 'running',
        value: adjustedRunningPercent,
        fill: '#FFA500', // Orange for running
      },
      {
        name: 'queued',
        value: adjustedQueuedPercent,
        fill: '#0000FF', // Blue for queued
      },
    ];
  }

  function makeLegend() {
    return (
      <Box>
        <Box>PASS/FAIL RATIO</Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box>{passed} passed</Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box>{failed} failed</Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>{total} total</Box>
          </Box>
        </Box>
      </Box>
    );
  }

  function getLabel() {
    if (totals?.results) {
      const total = totals.results;
      if (total === 0) return '0%';
      const percentage = Math.round((totals.passed / totals.results) * 100);
      return `${percentage}%`;
    }
    return '0%';
  }

  return (
    <RatioChart data={makeData()} total={100} label={getLabel()} legend={makeLegend()}></RatioChart>
  );
}

function TestWorkflowsRunningQueuedChart(data: { totals: any }) {
  const { totals } = data;

  const [running, queued] = [totals.running, totals.queued];
  const total = totals.running + totals.queued;

  function makeData() {
    return [
      {
        name: 'running',
        value: running,
        fill: '#007501',
      },
      {
        name: 'queued',
        value: queued,
        fill: '#DC0000',
      },
    ];
  }

  function makeLegend() {
    return (
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box>{running} running</Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>{queued} queued</Box>
          </Box>
        </Box>
      </Box>
    );
  }

  function getLabel() {
    if (running > 0) {
      return 'Running';
    } else if (queued > 0) {
      return 'Queued';
    }
    return '';
  }

  return (
    <RatioChart
      data={makeData()}
      total={total}
      label={getLabel()}
      legend={makeLegend()}
    ></RatioChart>
  );
}

interface RatioChartProps {
  data: Array<any>;
  total: number;
  label: string;
  legend: any;
}

function RatioChart(props: RatioChartProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      <TileChart data={props.data} total={props.total} label={props.label} legend={props.legend} />
    </Box>
  );
}
