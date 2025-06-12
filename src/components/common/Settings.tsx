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

type ClusterData = {
  isTestkubeEnabled?: boolean;
  autoDetect?: boolean;
  address?: string;
};

type Conf = {
  [cluster: string]: ClusterData;
};

export function getConfigStore(): ConfigStore<Conf> {
  return new ConfigStore<Conf>(PLUGIN_NAME);
}

export function getClusterConfig(cluster: string): ClusterData | null {
  const configStore = getConfigStore();
  const conf = configStore.get();
  if (!cluster || !conf) {
    return null;
  }
  return conf[cluster] || null;
}

export function enableTestkube(cluster: string) {
  const store = getConfigStore();
  const config = store.get() || {};
  const clusterConfig = config[cluster] || { autoDetect: true };
  store.update({
    ...config,
    [cluster]: {
      ...clusterConfig,
      isTestkubeEnabled: true,
    },
  });
}

export function disableTestkube(cluster: string) {
  const store = getConfigStore();
  const config = store.get() || {};
  const clusterConfig = config[cluster] || { autoDetect: true };
  store.update({
    ...config,
    [cluster]: {
      ...clusterConfig,
      isTestkubeEnabled: false,
    },
  });
}

export function isTestkubeEnabled(cluster: string): boolean {
  const clusterData = getClusterConfig(cluster);
  return clusterData?.isTestkubeEnabled ?? false;
}

function isValidAddress(address: string): boolean {
  const regex = /^[a-z0-9-]+\/[a-z0-9-]+:[0-9]+$/;
  return regex.test(address);
}

interface SettingsProps {
  data: Record<
    string,
    {
      isTestkubeEnabled?: boolean;
      autoDetect?: boolean;
      address?: string;
    }
  >;
  onDataChange: (newData: SettingsProps['data']) => void;
}

export function Settings(props: SettingsProps) {
  const { data, onDataChange } = props;
  const [selectedCluster, setSelectedCluster] = useState('');
  const [addressError, setAddressError] = useState(false);

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
          isTestkubeEnabled: true,
          autoDetect: true,
        },
      });
    }
  }, [selectedCluster, data, onDataChange]);

  const selectedClusterData = data?.[selectedCluster] || {};
  const isTestkubeEnabled = selectedClusterData.isTestkubeEnabled ?? true;
  const isAutoDetectEnabled = isTestkubeEnabled && (selectedClusterData.autoDetect ?? true);
  const isAddressFieldEnabled = isTestkubeEnabled && !isAutoDetectEnabled;

  useEffect(() => {
    if (selectedClusterData.address) {
      setAddressError(!isValidAddress(selectedClusterData.address));
    } else {
      setAddressError(false);
    }
  }, [selectedClusterData.address]);

  const settingsRows = [
    {
      name: 'Enable Testkube',
      value: (
        <Switch
          checked={isTestkubeEnabled}
          onChange={e => {
            const newTestkubeEnabled = e.target.checked;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                isTestkubeEnabled: newTestkubeEnabled,
                autoDetect: newTestkubeEnabled
                  ? data?.[selectedCluster]?.autoDetect ?? true
                  : false,
              },
            });
          }}
        />
      ),
    },
    {
      name: 'Auto detect',
      value: (
        <Switch
          disabled={!isTestkubeEnabled}
          checked={isAutoDetectEnabled}
          onChange={e =>
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                autoDetect: e.target.checked,
              },
            })
          }
        />
      ),
    },
    {
      name: 'Testkube Api Address',
      value: (
        <TextField
          disabled={!isAddressFieldEnabled}
          helperText={
            addressError
              ? 'Invalid format. Use: namespace/service-name:port'
              : 'Address of the Prometheus Service, only used when auto-detection is disabled. Format: namespace/service-name:port'
          }
          error={addressError}
          value={selectedClusterData.address || ''}
          onChange={e => {
            const newAddress = e.target.value;
            onDataChange({
              ...(data || {}),
              [selectedCluster]: {
                ...((data || {})[selectedCluster] || {}),
                address: newAddress,
              },
            });
            setAddressError(!isValidAddress(newAddress));
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
