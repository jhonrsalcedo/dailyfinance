'use client'

import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material'

export function BudgetSkeleton() {
  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Skeleton variant="text" width="50%" height={24} />
                </Box>
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="30%" height={16} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Skeleton variant="text" width="35%" height={14} />
                  <Skeleton variant="text" width="35%" height={14} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}