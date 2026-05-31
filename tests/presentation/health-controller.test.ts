import { assertEquals } from 'jsr:@std/assert@^1.0.0';
import { Box } from '@catniplabs/box';
import { HealthController } from '../../src/presentation/controllers/health-controller.ts';

Deno.test('HealthController - returns ok status', async () => {
  const app = Box.createApp({
    controllers: [HealthController],
  });

  const request = new Request('http://localhost/health');
  const response = await app.fetch(request);

  assertEquals(response.status, 200);
  const body = await response.json();
  assertEquals(body.status, 'ok');
  assertEquals(typeof body.timestamp, 'string');
});
