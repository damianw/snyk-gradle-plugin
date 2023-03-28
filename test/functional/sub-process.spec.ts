import { execute } from '../../lib/sub-process';

describe('sub-process', () => {
  let preTestEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    preTestEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...preTestEnv };
  });

  it('restores proxy environment', async () => {
    process.env.SNYK_SYSTEM_HTTPS_PROXY = 'http://1.1.1.1';
    process.env.SNYK_SYSTEM_HTTP_PROXY = 'http://2.2.2.2';
    process.env.SNYK_SYSTEM_NO_PROXY = 'snyk.com';

    process.env.HTTPS_PROXY = 'http://127.0.0.1';
    process.env.HTTP_PROXY = 'http://127.0.0.1';
    process.env.NO_PROXY = 'example.com';

    const result = await execute('env', [], {});

    expect(result).toContain('HTTPS_PROXY=http://1.1.1.1');
    expect(process.env.HTTPS_PROXY).toStrictEqual('http://127.0.0.1');

    expect(result).toContain('HTTP_PROXY=http://2.2.2.2');
    expect(process.env.HTTP_PROXY).toStrictEqual('http://127.0.0.1');

    expect(result).toContain('NO_PROXY=snyk.com');
    expect(process.env.NO_PROXY).toStrictEqual('example.com');
  });
});
