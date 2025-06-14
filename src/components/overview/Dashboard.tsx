import { Link, PageGrid, SectionBox } from '@kinvolk/headlamp-plugin/lib/components/common';
import { Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import { StatusIcon } from '../common/TestKubeIconPack';

const Dashboard: React.FC = () => {
  // 統計卡片資料
  const statsCards = [
    {
      title: 'Tests',
      value: 0,
      color: 'primary',
      // linkTo: 'Tests',
    },
    {
      title: 'Test Workflows',
      value: 0,
      color: 'action',
      linkTo: 'TestWorkflows',
    },
    {
      title: 'Running',
      value: 0,
      icon: StatusIcon({ status: 'running', animated: true }),
      color: '#2196f3',
    },
    {
      title: 'Passed',
      value: 3,
      icon: StatusIcon({ status: 'success' }),
      color: 'green',
    },
    {
      title: 'Failed',
      value: 5,
      icon: StatusIcon({ status: 'error' }),
      color: 'error',
    },
    {
      title: 'Queued',
      value: 5,
      icon: StatusIcon({ status: 'queued' }),
      color: '#ff9800',
    },
  ];

  if (statsCards && statsCards.length === 0) {
    return (
      <PageGrid>
        <SectionBox title="Loading TestKube Dashboard...">
          <LinearProgress />
        </SectionBox>
      </PageGrid>
    );
  }

  return (
    <>
      <SectionBox title="Testkube Overview">
        <Grid container spacing={3}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent color={`${card.color}`}>
                  <Box color={`${card.color}`} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box color={`${card.color}`} sx={{ mr: 1 }}>
                      {card.icon}
                    </Box>
                    <Typography variant="h5" color={`${card.color}`} sx={{ ml: 1 }}>
                      {card.linkTo ? <Link routeName={card.linkTo}>{card.title}</Link> : card.title}
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" align="right" color={`${card.color}`}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </SectionBox>
    </>
  );
};

export default Dashboard;
