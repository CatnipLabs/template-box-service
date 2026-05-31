import { Box } from '@catniplabs/box';

@Box.Controller('/health')
export class HealthController {
  @Box.Get('/', {
    summary: 'Health check',
    responses: {
      [Box.HttpStatus.OK]: {
        description: 'Service is healthy',
      },
    },
  })
  public health(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
