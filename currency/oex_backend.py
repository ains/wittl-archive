from decimal import Decimal
from money.exchange import BackendBase
from partner_api.open_exchange_rates import OpenExchangeRatesAPI


class OpenExchangeRatesBackend(BackendBase):
    def __init__(self):
        self.rates = None

    @property
    def base(self):
        return "USD"

    @property
    def get_exchange_rates(self):
        if self.rates is None:
            self.rates = OpenExchangeRatesAPI().get_latest_rates(self.base)
        return self.rates

    def rate(self, currency):
        exchange_rates = self.get_exchange_rates
        return Decimal(exchange_rates["rates"][currency])

    def quotation(self, origin, target):
        return super(OpenExchangeRatesBackend, self).quotation(origin, target)