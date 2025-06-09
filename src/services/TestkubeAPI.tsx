import {ApiProxy} from '@kinvolk/headlamp-plugin/lib';

const request = ApiProxy.request;

export async function _fetchTestWorkflowExecutes(data: {
  prefix?: string;
  apiPath?: string;
  testWorkflow: string;
}): Promise<object> {

  const prefix = data.prefix || 'testkube/services/testkube-api-server:8088';
  const apiPath = `v1/test-workflows/${data.testWorkflow}/executions`;
  const url = `/api/v1/namespaces/${prefix}/proxy/${apiPath}`;

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

export async function _executeTestWorkflow(data: {
  prefix?: string;
  apiPath?: string;
  testWorkflow: string;
}): Promise<object> {

  const prefix = data.prefix || 'testkube/services/testkube-api-server:8088';
  const apiPath = `v1/test-workflows/${data.testWorkflow}/executions`;
  const url = `/api/v1/namespaces/${prefix}/proxy/${apiPath}`;

  const payload = {}

  const response = await request(url, {
    method: 'POST',
    isJSON: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (response?.id) {
    return response;
  } else {
    const error = new Error(response.statusText);
    return Promise.reject(error);
  }
}

export function FetchTestWorkflowExecutes(callback: any, testWorkflow: string) {
  _fetchTestWorkflowExecutes({
    testWorkflow: testWorkflow
  }).then((rows: any) => {
    callback(rows.results);
  });
}

export async function ExecuteTestWorkflow(testWorkflow: string): Promise<object> {
  return _executeTestWorkflow({
    testWorkflow: testWorkflow
  });
}
