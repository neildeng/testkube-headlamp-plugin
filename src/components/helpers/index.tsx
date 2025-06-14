import {
  HoverInfoLabel,
  Link,
  SectionBox,
  ShowHideLabel,
} from '@kinvolk/headlamp-plugin/lib/components/common';
import Event from '@kinvolk/headlamp-plugin/lib/K8s/event';
import { KubeObjectClass } from '@kinvolk/headlamp-plugin/lib/lib/k8s/cluster';
import { localeDate, timeAgo } from '@kinvolk/headlamp-plugin/lib/Utils';
import Table from '../common/Table';
import { PluralName } from './pluralName';

export function ObjectEvents(props: {
  name: string;
  namespace: string;
  resourceClass: KubeObjectClass;
}) {
  const { name, namespace, resourceClass } = props;

  const [events] = Event.useList({
    namespace,
    fieldSelector: `involvedObject.name=${name},involvedObject.kind=${resourceClass.kind}`,
  });

  if (!events) {
    return <></>;
  }
  return <ObjectEventsRenderer events={events} />;
}

export function ObjectEventsRenderer(props: { events?: Event[] }) {
  const { events } = props;

  if (!events) {
    return <></>;
  }

  return (
    <SectionBox title={'Events'}>
      <Table
        // @ts-ignore -- TODO Update the sorting param
        defaultSortingColumn={4}
        columns={[
          {
            header: 'Type',
            accessorFn: item => {
              return item.type;
            },
          },
          {
            header: 'Reason',
            accessorFn: item => {
              return item.reason;
            },
          },
          {
            header: 'From',
            accessorFn: item => {
              return item.source.component;
            },
          },
          {
            header: 'Message',
            accessorFn: item => {
              return (
                item && (
                  <ShowHideLabel labelId={`${item?.metadata?.uid}-message`}>
                    {item.message ?? ''}
                  </ShowHideLabel>
                )
              );
            },
          },
          {
            id: 'age',
            header: 'Age',
            accessorFn: item => {
              if (item.count > 1) {
                return `${timeAgo(item.lastOccurrence)} (${item.count} times over ${timeAgo(
                  item.firstOccurrence
                )})`;
              }
              const eventDate = timeAgo(item.lastOccurrence, { format: 'mini' });
              let label: string;
              if (item.count > 1) {
                label = `${eventDate} ${item.count} times since ${timeAgo(item.firstOccurrence)}`;
              } else {
                label = eventDate;
              }

              return (
                <HoverInfoLabel
                  label={label}
                  hoverInfo={localeDate(item.lastOccurrence)}
                  icon="mdi:calendar"
                />
              );
            },
            gridTemplate: 'min-content',
            enableColumnFilter: false,
            muiTableBodyCellProps: {
              align: 'right',
            },
          },
        ]}
        data={events}
        initialState={{
          sorting: [
            {
              id: 'age',
              desc: false,
            },
          ],
        }}
      />
    </SectionBox>
  );
}

export function TestKubeLink(resourceClass: KubeObjectClass) {
  const pluralName = PluralName(resourceClass.kind);

  return {
    header: 'Name',
    accessorKey: 'metadata.name',
    Cell: ({ cell, row }) => (
      <>
        <Link
          routeName={pluralName.slice(0, -1)}
          params={{
            name: row.original.jsonData.metadata.name,
            namespace: row.original.jsonData.metadata.namespace,
            pluralName: pluralName,
          }}
        >
          {cell.getValue()}
        </Link>
      </>
    ),
  };
}
