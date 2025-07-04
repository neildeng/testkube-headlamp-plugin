import { addIcon } from '@iconify/react';
import {
  registerPluginSettings,
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';
import { PLUGIN_NAME, Settings } from './components/common/Settings';
import Overview from './components/overview/Overview';
import { TemplatesList } from './components/templates';
import { TestsDetailViewer, TestsList } from './components/tests';
import { TestSourceDetailViewer, TestSourcesList } from './components/testsources';
import { TestWorkflowDetailViewer } from './components/testworkflows/TestWorkflowDetailViewer';
import { TestWorkflowsList } from './components/testworkflows/TestWorkflowsList';
import {
  TestWorkflowTemplatesDetailViewer,
  TestWorkflowTemplatesList,
} from './components/testworkflowtemplates';

// TODO: Remove this when legacy support is dropped
const enabledLegacy = true;

addIcon('simple-icons:testkube', {
  body: '<path fill="currentColor" d="M5.91 22.38 l-5.35 -5.35 -0.18 -3.06 c-0.15 -2.70 -0.11 -3.14 0.55 -3.88 1.85 -1.99 11.04 -9.75 11.45 -9.64 0.30 0.07 2.99 2.55 6.06 5.58 l5.58 5.43 0 2.70 c0 1.44 -0.15 2.88 -0.30 3.10 -0.63 1.03 -11.37 10.41 -11.89 10.45 -0.30 0 -2.95 -2.40 -5.91 -5.32z m5.54 2.44 l0 -1.81 -4.32 -4.25 c-4.21 -4.17 -4.32 -4.28 -5.17 -3.73 -0.48 0.30 -0.85 0.85 -0.85 1.18 0 0.55 9.49 10.38 10.04 10.38 0.18 0 0.30 -0.81 0.30 -1.77z m6.76 -3.32 c2.77 -2.55 5.06 -4.73 5.06 -4.87 0 -0.11 -0.41 -0.63 -0.92 -1.11 l-0.89 -0.85 -1.96 1.74 c-1.07 0.96 -3.18 2.77 -4.62 4.02 l-2.66 2.29 -0.04 1.96 c0 1.48 0.11 1.88 0.48 1.70 0.22 -0.18 2.73 -2.36 5.54 -4.87z m-1.66 -3.43 c2.29 -2.03 4.14 -3.84 4.14 -3.99 0 -0.18 -1.77 -1.99 -3.91 -4.06 -2.55 -2.47 -4.14 -3.73 -4.58 -3.66 -0.66 0.11 -8.86 7.20 -8.86 7.68 0 0.59 7.72 7.75 8.38 7.75 0.41 0 2.55 -1.66 4.84 -3.73z m-14.70 -4.25 c0 -0.30 -0.15 -0.52 -0.37 -0.52 -0.18 0 -0.37 0.33 -0.37 0.78 0 0.41 0.18 0.63 0.37 0.52 0.22 -0.11 0.37 -0.48 0.37 -0.78z m5.43 -4.47 c4.28 -3.88 4.36 -3.99 4.58 -5.80 0.11 -1.03 0.15 -1.96 0.07 -2.03 -0.07 -0.11 -0.48 0.18 -0.96 0.55 -9.64 8.53 -10.19 9.08 -9.97 9.67 0.26 0.63 1.18 1.51 1.66 1.55 0.11 0 2.18 -1.77 4.62 -3.95z"/>',
  width: 24,
  height: 28,
});

registerPluginSettings(PLUGIN_NAME, Settings, true);

// Main Testkube sidebar entry
registerSidebarEntry({
  icon: 'simple-icons:testkube',
  label: 'Testkube',
  name: PLUGIN_NAME,
  parent: '',
  url: `/${PLUGIN_NAME}/overview`,
});

/************************************
 Overview
 ************************************/

registerSidebarEntry({
  label: 'Overview',
  name: 'TestkubeOverview',
  parent: PLUGIN_NAME,
  url: `/${PLUGIN_NAME}/overview`,
});

registerRoute({
  component: () => <Overview />,
  exact: true,
  name: 'TestkubeOverview',
  parent: PLUGIN_NAME,
  path: `/${PLUGIN_NAME}/overview`,
  sidebar: 'TestkubeOverview',
});

/************************************
 Test Sources (Legacy)
 ************************************/

if (enabledLegacy) {
  registerSidebarEntry({
    label: '(Legacy) Test Sources',
    name: 'TestSources',
    parent: PLUGIN_NAME,
    url: `/${PLUGIN_NAME}/testsources`,
  });

  registerRoute({
    component: () => <TestSourcesList />,
    exact: true,
    name: 'TestSources',
    parent: PLUGIN_NAME,
    path: `/${PLUGIN_NAME}/testsources`,
    sidebar: 'TestSources',
  });

  registerRoute({
    component: () => <TestSourceDetailViewer />,
    exact: true,
    name: 'testsource',
    parent: PLUGIN_NAME,
    path: `/${PLUGIN_NAME}/testsource/:namespace/:name`,
    sidebar: 'TestSources',
  });
}
/************************************
 Templates (Legacy)
 ************************************/

if (enabledLegacy) {
  registerSidebarEntry({
    label: '(Legacy) Templates',
    name: 'Templates',
    parent: PLUGIN_NAME,
    url: `/${PLUGIN_NAME}/templates`,
  });

  registerRoute({
    component: () => <TemplatesList />,
    exact: true,
    name: 'Templates',
    parent: PLUGIN_NAME,
    path: `/${PLUGIN_NAME}/templates`,
    sidebar: 'Templates',
  });
}
/************************************
 Tests (Legacy)
 ************************************/

if (enabledLegacy) {
  registerSidebarEntry({
    label: '(Legacy) Tests',
    name: 'Tests',
    parent: PLUGIN_NAME,
    url: `/${PLUGIN_NAME}/tests`,
  });

  registerRoute({
    component: () => <TestsList />,
    exact: true,
    name: 'Tests',
    parent: PLUGIN_NAME,
    path: `/${PLUGIN_NAME}/tests`,
    sidebar: 'Tests',
  });

  registerRoute({
    component: () => <TestsDetailViewer />,
    exact: true,
    name: 'test',
    parent: PLUGIN_NAME,
    path: `/${PLUGIN_NAME}/tests/:namespace/:name`,
    sidebar: 'Tests',
  });
}

/************************************
 TWF Templates
 ************************************/

registerSidebarEntry({
  label: 'TWF Templates',
  name: 'testworkflowtemplates',
  parent: PLUGIN_NAME,
  url: `/${PLUGIN_NAME}/testworkflowtemplates`,
});

registerRoute({
  component: () => <TestWorkflowTemplatesList />,
  exact: true,
  name: 'testworkflowtemplates',
  parent: PLUGIN_NAME,
  path: `/${PLUGIN_NAME}/testworkflowtemplates`,
  sidebar: 'testworkflowtemplates',
});

registerRoute({
  component: () => <TestWorkflowTemplatesDetailViewer />,
  exact: true,
  name: 'testworkflowtemplate',
  parent: PLUGIN_NAME,
  path: `/${PLUGIN_NAME}/testworkflowtemplate/:namespace/:name`,
  sidebar: 'testworkflowtemplates',
});

/************************************
 TWF Tests
 ************************************/

registerSidebarEntry({
  label: 'TWF Tests',
  name: 'testworkflows',
  parent: PLUGIN_NAME,
  url: `/${PLUGIN_NAME}/testworkflows`,
});

registerRoute({
  component: () => <TestWorkflowsList />,
  exact: true,
  name: 'testworkflows',
  parent: PLUGIN_NAME,
  path: `/${PLUGIN_NAME}/testworkflows`,
  sidebar: 'testworkflows',
});

registerRoute({
  component: () => <TestWorkflowDetailViewer />,
  exact: true,
  name: 'testworkflow',
  parent: PLUGIN_NAME,
  path: `/${PLUGIN_NAME}/testworkflow/:namespace/:name`,
  sidebar: 'testworkflows',
});
