import {ApiProxy} from '@kinvolk/headlamp-plugin/lib';

const request = ApiProxy.request;

export enum KubernetesType {
  services = 'services',
}

export type PrometheusEndpoint = {
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
): PrometheusEndpoint {
  return {
    type,
    name,
    namespace,
    port,
  };
}

function makeTestkubeUrl(endpoint: PrometheusEndpoint) {
  return `/api/v1/namespaces/${endpoint.namespace}/${endpoint.type.toString()}/${endpoint.name}:${endpoint.port}/proxy/`;
}

async function getTestKube(props: {
  apiPath: string;
  query?: string;
}): Promise<any> {
  const params = new URLSearchParams();
  if (props.query) {
    params.append('query', props.query);
  }

  const url = `${makeTestkubeUrl(createTestKubeEndpoint())}${props.apiPath}?${params.toString()}`;

  const response = await request(url, {
    method: 'GET',
    isJSON: false
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
    console.log("Fetching executes for test workflow:", props.name);
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
    console.log("Run executes for test workflow:", props.name);
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