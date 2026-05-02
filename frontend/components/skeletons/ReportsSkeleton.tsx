'use client'

import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material'

export function ReportsSkeleton() {
  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="70%" height={40} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="70%" height={40} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="70%" height={40} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="70%" height={40} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}