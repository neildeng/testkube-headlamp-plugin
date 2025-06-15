import { ConfigStore } from '@kinvolk/headlamp-plugin/lib';
import { NameValueTable } from '@kinvolk/headlamp-plugin/lib/components/common';
import { useClustersConf } from '@kinvolk/headlamp-plugin/lib/k8s';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

export const PLUGIN_NAME = 'testkube';

type TestkubeSettings = {
  namespace?: string;
  apiServiceName?: string;
  apiServicePort?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  defaultTimeout?: number;
};

type Conf = {
  [cluster: string]: TestkubeSettings;
};

export function getConfigStore(): ConfigStore<Conf> {
  return new ConfigStore<Conf>(PLUGIN_NAME);
}

export function getClusterConfig(cluster: string): TestkubeSettings | null {
  const configStore = getConfigStore();
  const conf = configStore.get();
  if (!cluster || !conf) {
    return null;
  }
  return conf[cluster] || null;
}

interface TestkubeSettingsProps {
  data: Record<string, TestkubeSettings>;
  onDataChange: (newData: TestkubeSettingsProps['data']) => void;
}

export function Settings(props: TestkubeSettingsProps) {
  const { data, onDataChange } = props;
  const [selectedCluster, setSelectedCluster] = useState('');

  const clusters = useClustersConf() || {};

  useEffect(() => {
    if (Object.keys(clusters).length > 0 && !selectedCluster) {
      setSelectedCluster(Object.keys(clusters)[0]);
    }
  }, [clusters, selectedCluster]);

  useEffect(() => {
    if (selectedCluster && !data?.[selectedCluster]) {
      onDataChange({
        ...data,
        [selectedCluster]: {
          namespace: 'testkube',
          apiServiceName: 'testkube-api-server',
          apiServicePort: '8088',
          autoRefresh: true,
          refreshInterval: 30000,
          defaultTimeout: 300,
        },
      });
    }
  }, [selectedCluster, data, onDataChange]);

  const selectedClusterData = data?.[selectedCluster] || {};

  const settingsRows = [
    {
      name: 'API Namespace',
      value: (
        <TextField
          value={selectedClusterData.namespace || ''}
          onChange={e => {
            const newVal = e.target.value;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                namespace: newVal,
              },
            });
          }}
        />
      ),
    },
    {
      name: 'API Service Name',
      value: (
        <TextField
          value={selectedClusterData.apiServiceName || ''}
          onChange={e => {
            const newVal = e.target.value;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                apiServiceName: newVal,
              },
            });
          }}
        />
      ),
    },
    {
      name: 'API Service Port',
      value: (
        <TextField
          value={selectedClusterData.apiServicePort || ''}
          onChange={e => {
            const newVal = e.target.value;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                apiServicePort: newVal,
              },
            });
          }}
        />
      ),
    },
    {
      name: 'Auto Refresh',
      value: (
        <Switch
          checked={selectedClusterData.autoRefresh}
          onChange={e => {
            const newVal = e.target.checked;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                autoRefresh: newVal ? data?.[selectedCluster]?.autoRefresh ?? true : false,
              },
            });
          }}
        />
      ),
    },
    {
      name: 'Refresh Interval',
      value: (
        <TextField
          disabled={!selectedClusterData.autoRefresh}
          value={selectedClusterData.refreshInterval || 30000}
          onChange={e => {
            const newVal = e.target.value;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                refreshInterval: newVal,
              },
            });
          }}
        />
      ),
    },
    {
      name: 'Default Timeout',
      value: (
        <TextField
          disabled={!selectedClusterData.autoRefresh}
          value={selectedClusterData.defaultTimeout || 300}
          onChange={e => {
            const newVal = e.target.value;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                defaultTimeout: newVal,
              },
            });
          }}
        />
      ),
    },
  ];

  return (
    <Box width={'80%'}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Select Cluster</Typography>
        <Select value={selectedCluster} onChange={e => setSelectedCluster(e.target.value)}>
          {Object.keys(clusters).map(clusterName => (
            <MenuItem key={clusterName} value={clusterName}>
              {clusterName}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <NameValueTable rows={settingsRows} />
    </Box>
  );
}
