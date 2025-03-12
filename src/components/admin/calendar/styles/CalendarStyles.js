
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const HeaderCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  width: '14.28%'
}));

export const DayCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentMonth' && prop !== 'isToday'
})(({ theme, isCurrentMonth, isToday }) => ({
  minHeight: 120,
  padding: theme.spacing(1),
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: isToday ? theme.palette.action.hover : theme.palette.background.paper,
  opacity: isCurrentMonth ? 1 : 0.5,
  width: '14.28%',
  position: 'relative',
  overflow: 'hidden'
}));

export const EventBar = styled(Box)(({ theme, isStart, isEnd }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(0.5),
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  position: 'relative',
  marginLeft: isStart ? 0 : -8,
  marginRight: isEnd ? 0 : -8,
  borderTopLeftRadius: isStart ? 4 : 0,
  borderBottomLeftRadius: isStart ? 4 : 0,
  borderTopRightRadius: isEnd ? 4 : 0,
  borderBottomRightRadius: isEnd ? 4 : 0,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
}));
