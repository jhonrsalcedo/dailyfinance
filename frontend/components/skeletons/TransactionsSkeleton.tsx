'use client'

import { Box, Card, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

export function TransactionsSkeleton() {
  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Skeleton variant="text" width={80} /></TableCell>
              <TableCell><Skeleton variant="text" width={100} /></TableCell>
              <TableCell><Skeleton variant="text" width={80} /></TableCell>
              <TableCell><Skeleton variant="text" width={120} /></TableCell>
              <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
              <TableCell align="center"><Skeleton variant="text" width={60} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width={100} />
                  </Box>
                </TableCell>
                <TableCell><Skeleton variant="text" width={80} /></TableCell>
                <TableCell><Skeleton variant="text" width={120} /></TableCell>
                <TableCell align="right"><Skeleton variant="text" width={100} /></TableCell>
                <TableCell align="center">
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}