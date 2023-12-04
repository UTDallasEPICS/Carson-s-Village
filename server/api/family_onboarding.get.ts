import { useRuntimeConfig } from '#imports';
import { getQuery } from 'h3';

const runtime = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { familyCuid } = await getQuery(event);

  if (!familyCuid) {
    // Handle the error case where familyCuid is not provided, if necessary
    // return { error: "Family CUID is required" };
  }

  return createRedirectResponse(event, `${runtime.BASEURL}/`);
});

function createRedirectResponse(event, location) {
  event.res.writeHead(302, { Location: location });
  event.res.end();
}
