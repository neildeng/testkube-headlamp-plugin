import {ActionButton, ConfirmDialog} from '@kinvolk/headlamp-plugin/lib/components/common';
import React from 'react'
import {useSnackbar} from 'notistack';
import {RunTestWorkflow} from "../../services/TestkubeProxyAPI";

function RunAction(props: any) {
  const {enqueueSnackbar} = useSnackbar();
  const [open, setOpen] = React.useState<boolean>(false);
  const {resource} = props;
  return (
    <>
      <ActionButton
        description="Run Test Workflow"
        icon={'mdi:play'}
        onClick={() => {
          setOpen(true);
        }}
      />
      <ConfirmDialog
        // @ts-ignore -- Remove this once mui types are working, related to wildcard paths in plugins-tsconfig.json
        open={open}
        title={'Run TestWorkflow'}
        description={'Are you sure you want to run a TestWorkflow?'}
        handleClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          (async () => {
            await RunTestWorkflow({name: resource.metadata.name})
              .then((response: any) => {
                enqueueSnackbar(
                  `Successfully execute TestWorkflow for executed.id(${response.id})`,
                  {variant: 'success'}
                )
              })
              .catch(error => {
                enqueueSnackbar(`error ${error}`, {variant: 'error'});
              });
          })();
        }}
      />
    </>
  );
}

export {
  RunAction,
};