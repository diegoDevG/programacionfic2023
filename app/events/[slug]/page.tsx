import Image from 'next/image';
import { WixMediaImage } from '@app/components/Image/WixMediaImage';
import { formatDate } from '@app/utils/date-formatter';
import { TicketsTable } from '@app/components/Table/Table.client';
import { getWixClient } from '@app/hooks/useWixClientServer';
import { wixEvents } from '@wix/events';
import { Schedule } from '@app/components/Schedule/Schedule';
import { TicketDefinitionExtended } from '@app/types/ticket';
import testIds from '@app/utils/test-ids';
import Share from '@app/components/Share/Share';

export default async function EventPage({ params }: any) {
  if (!params.slug) {
    return;
  }
  const wixClient = await getWixClient();
  const { events } = await wixClient.wixEvents.queryEventsV2({
    fieldset: [
      wixEvents.EventFieldset.FULL,
      wixEvents.EventFieldset.DETAILS,
      wixEvents.EventFieldset.TEXTS,
      wixEvents.EventFieldset.REGISTRATION,
    ],
    query: {
      filter: { slug: decodeURIComponent(params.slug) },
      paging: { limit: 1, offset: 0 },
    },
  });
  const event = events?.length ? events![0] : null;

  const tickets =
    event &&
    ((
      await wixClient.checkout.queryAvailableTickets({
        filter: { eventId: event._id },
        offset: 0,
        limit: 100,
        sort: 'orderIndex:asc',
      })
    ).definitions?.map((ticket) => ({
      ...ticket,
      canPurchase:
        ticket.limitPerCheckout! > 0 &&
        (!ticket.salePeriod ||
          (new Date(ticket.salePeriod.endDate!) > new Date() &&
            new Date(ticket.salePeriod.startDate!) < new Date())),
    })) as TicketDefinitionExtended[]);
  const schedule =
    event &&
    (await wixClient.schedule.listScheduleItems({
      eventId: [event._id!],
      limit: 100,
    }));

  return (
    <div className="mx-auto px-4 sm:px-14">
      {event ? (
        <div
          className="full-w overflow-hidden max-w-6xl mx-auto"
          data-testid={testIds.TICKET_DETAILS_PAGE.CONTAINER}
        >
          <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900 text-white max-w-6xl sm:max-w-5xl items-lef sm:items-center mx-auto">
            <div className="basis-1/2">
              <WixMediaImage
                media={event.mainImage}
                width={530}
                height={530}
                className="max-h-[320px] sm:h-[530px] sm:max-h-[530px]"
              />
            </div>
            <div className="basis-1/2 text-left px-5 pb-4">
              <span>
                {formatDate(
                  new Date(event.scheduling?.config?.startDate!),
                  event!.scheduling!.config!.timeZoneId!
                ) || event.scheduling?.formatted}{' '}
                | {event.location?.name}
              </span>
              <h1
                data-testid={testIds.TICKET_DETAILS_PAGE.HEADER}
                className="text-3xl sm:text-5xl my-2"
              >
                {event.title}
              </h1>
              <h3 className="my-4 sm:my-6">{event.description}</h3>
              {event.registration?.status ===
                wixEvents.RegistrationStatus.OPEN_TICKETS && (
                <a
                  className="btn-main inline-block w-full sm:w-auto text-center"
                  href={`/events/${event.slug}#tickets`}
                >
                  Mas info del evento
                </a>
              )}
              {event.registration?.status ===
                wixEvents.RegistrationStatus.OPEN_EXTERNAL && (
                <a
                  className="btn-main inline-block w-full sm:w-auto text-center"
                  href={event.registration.external!.registration}
                >
                  Registrarse
                </a>
              )}
              {[
                wixEvents.RegistrationStatus.CLOSED_MANUALLY,
                wixEvents.RegistrationStatus.CLOSED,
              ].includes(event.registration?.status!) && (
                <div>
                  <p className="border-2 inline-block p-3">
                    Registration is closed
                    <br />
                    <a href="/" className="underline">
                      See other events
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="max-w-3xl mx-auto text-[14px] sm:text-base px-3 sm:px-0">
            <h2 className="mt-7">Hora y ubicación</h2>
            <p className="font-helvetica">{event.scheduling?.formatted}</p>
            <p className="font-helvetica">{event.location?.address}</p>
            {event.about !== '<p></p>' ? (
              <>
                <h2 className="mt-7">Acerca del evento</h2>
                <div
                  className="font-helvetica"
                  dangerouslySetInnerHTML={{ __html: event.about ?? '' }}
                />
              </>
            ) : null}
            {schedule?.items?.length ? (
              <div className="mb-4 sm:mb-14">
                <h2 className="mt-7">Agenda</h2>
                <Schedule items={schedule.items} slug={event.slug!} />
              </div>
            ) : null}
            {event.registration?.external && (
              <a
                className="btn-main my-10 inline-block"
                href={event.registration?.external.registration}
              >
                Registrarse
              </a>
            )}
            {[
              wixEvents.RegistrationStatus.CLOSED_MANUALLY,
              wixEvents.RegistrationStatus.OPEN_TICKETS,
            ].includes(event.registration?.status!) && (
              <div className="my-4 sm:my-10">
                <h2 className="mt-7">TICKETS</h2>
                <TicketsTable tickets={tickets!} event={event} />
              </div>
            )}
            <div className="my-4">
              <h2 className="mt-7">Comparte este evento</h2>
              <div className="my-4 flex gap-2">
                <Share />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-3xl w-full text-center p-9 box-border">
          Evento no encontrado
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams(): Promise<{ slug?: string }[]> {
  const wixClient = await getWixClient();
  return wixClient.wixEvents
    .queryEventsV2({
      fieldset: [wixEvents.EventFieldset.FULL],
      query: {
        paging: { limit: 10, offset: 0 },
        sort: [{ fieldName: 'start', order: wixEvents.SortOrder.ASC }],
      },
    })
    .then(({ events }) => {
      return events!.map((event) => ({
        slug: event.slug,
      }));
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
