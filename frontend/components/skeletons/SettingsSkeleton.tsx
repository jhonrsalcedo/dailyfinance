'use client'

import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material'

export function SettingsSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={28} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1, mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1, mb: 2 }} />
              <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Skeleton variant="text" width="50%" height={28} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1, mb: 2 }} />
              <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Skeleton variant="text" width="45%" height={28} sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
              </Box>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}