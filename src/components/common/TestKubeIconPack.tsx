import { Icon } from '@iconify/react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

// 將 Iconify 圖示包裝成 Material-UI SvgIcon 格式
export const createMuiIcon = (iconName: string, size: number) => {
  return React.forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
    <SvgIcon {...props} ref={ref}>
      <Icon icon={iconName} width={size} height={size} />
    </SvgIcon>
  ));
};

// 動態狀態圖示元件
export const StatusIcon: React.FC<{
  status: string;
  size?: number;
  animated?: boolean;
}> = ({ status, size = 24, animated = true }) => {
  const commonProps = { width: size, height: size };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'passed':
      case 'success':
        return <Icon icon="mdi:check-circle" color="#4caf50" {...commonProps} />;
      case 'failed':
      case 'error':
        return <Icon icon="mdi:close-circle" color="#f44336" {...commonProps} />;
      case 'running':
        return (
          <Icon
            icon="mdi:play-circle-outline"
            color="#2196f3"
            {...commonProps}
            className={animated ? 'animated-spin' : ''}
          />
        );
      case 'pending':
      case 'queued':
        return (
          <Icon
            icon="mdi:clock"
            color="#ff9800"
            {...commonProps}
            className={animated ? 'animate-pulse' : ''}
          />
        );
      case 'aborted':
        return <Icon icon="mdi:stop-circle" color="#9e9e9e" {...commonProps} />;
      case 'timeout':
        return <Icon icon="mdi:timer-off" color="#f44336" {...commonProps} />;
      case 'skipped':
        return <Icon icon="mdi:skip-next" color="#9e9e9e" {...commonProps} />;
      default:
        return <Icon icon="mdi:help-circle" color="#9e9e9e" {...commonProps} />;
    }
  };

  return getStatusIcon();
};
