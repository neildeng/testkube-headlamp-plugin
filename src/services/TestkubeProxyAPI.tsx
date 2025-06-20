import { ApiProxy } from '@kinvolk/headlamp-plugin/lib';

const request = ApiProxy.request;

export enum KubernetesType {
  services = 'services',
}

export type TestKubeEndpoint = {
  type: KubernetesType;
  name: string | undefined;
  namespace: string | undefined;
  port: string | undefined;
};

export function createTestKubeEndpoint(
  type: KubernetesType = KubernetesType.services,
  name: string | undefined = 'testkube-api-server',
  namespace: string | undefined = 'testkube',
  port: string | undefined = '8088'
): TestKubeEndpoint {
  return {
    type,
    name,
    namespace,
    port,
  };
}

function makeTestkubeUrl(endpoint: TestKubeEndpoint) {
  return `/api/v1/namespaces/${endpoint.namespace}/${endpoint.type.toString()}/${endpoint.name}:${
    endpoint.port
  }/proxy/`;
}

async function getTestKube(props: { apiPath: string; query?: string }): Promise<any> {
  const params = new URLSearchParams();
  if (props.query) {
    params.append('query', props.query);
  }

  const url = `${makeTestkubeUrl(createTestKubeEndpoint())}${props.apiPath}${
    params.toString() !== '' ? '?' : ''
  }${params.toString()}`;

  const response = await request(url, {
    method: 'GET',
    isJSON: false,
  });
  if (response.status === 200) {
    return response.json();
  } else {
    const error = new Error(response.statusText);
    return Promise.reject(error);
  }
}

async function postTestKube(props: {
  apiPath: string;
  query?: string;
  isJSON: boolean;
  payload?: object;
}): Promise<any> {
  const params = new URLSearchParams();
  if (props.query) {
    params.append('query', props.query);
  }

  const url = `${makeTestkubeUrl(createTestKubeEndpoint())}${props.apiPath}?${params.toString()}`;

  const response = await request(url, {
    method: 'POST',
    isJSON: props.isJSON,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props.payload),
  });
  if (response.status === 200) {
    return response;
  } else {
    const error = new Error(response.statusText);
    return Promise.reject(error);
  }
}

interface TestkubeWorkflowProps {
  name: string;
}

export async function GetTestkubeWorkflowExecutes(props: TestkubeWorkflowProps) {
  try {
    const response = await getTestKube({
      apiPath: `v1/test-workflows/${props.name}/executions`,
    });
    return response || [];
  } catch (response) {
    const error = new Error(response.statusText);
    return Promise.reject(error);
  }
}

export async function RunTestWorkflow(props: TestkubeWorkflowProps) {
  try {
    const response = await postTestKube({
      apiPath: `v1/test-workflows/${props.name}/executions`,
      isJSON: false,
      payload: {},
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function DownloadTestWorkflowArtifactsAction(executionId: string): Promise<void> {
  try {
    const url = `${makeTestkubeUrl(
      createTestKubeEndpoint()
    )}v1/test-workflow-executions/${executionId}/artifact-archive`;

    const response = await request(url, {
      method: 'GET',
      isJSON: false,
    });

    if (!response.ok) {
      throw new Error(`下載失敗: HTTP ${response.status} - ${response.statusText}`);
    }

    // 取得 Blob 資料
    const blob = await response.blob();

    // 觸發瀏覽器下載
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `execution-${executionId}-artifacts.tar.gz`;

    // 觸發下載
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    console.log('檔案下載完成');
  } catch (error) {
    console.error('下載 artifacts 失敗:', error);
    throw error;
  }
}
