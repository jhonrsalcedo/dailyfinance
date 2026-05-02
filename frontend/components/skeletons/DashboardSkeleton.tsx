'use client'

import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material'

export function DashboardSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="60%" height={48} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="60%" height={48} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="60%" height={48} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1 }} />
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="35%" height={28} sx={{ mb: 2 }} />
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="25%" height={16} />
              </Box>
              <Skeleton variant="text" width="15%" height={24} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  )
}