import re
import traceback

from distance_from import DistanceFromComparator
from travel_prices_from import TravelPricesFromComparator
from travel_time_from import TravelTimeFromComparator
from weather import WeatherComparator
from nearby import NearbyComparator


# Magic/Reflection method of getting all comparators
# Disabled for now, may be used later

# module_list = [name for (_, name, _) in pkgutil.iter_modules([__name__])]
# def is_comparator(c):
#     return inspect.isclass(c) and 'comparator' in c.__module__
#
# def get_comparators_in_module(module_name):
#     return [comparator_class for (_, comparator_class)
#             in inspect.getmembers(importlib.import_module("{}.{}".format(__name__, module_name)), is_comparator)]
# all_comparators = {
#     comparator.NAME: comparator for
#     comparator in set(itertools.chain(*map(get_comparators_in_module, module_list)))
# }


ENABLED_COMPARATORS = [
    DistanceFromComparator,
    TravelPricesFromComparator,
    TravelTimeFromComparator,
    WeatherComparator,
    NearbyComparator,
]
all_comparators = {comparator.NAME: comparator for comparator in ENABLED_COMPARATORS}


def run_comparator_by_trigger(trigger_string, object):
    for (_, comparator_class) in all_comparators.items():
        triggers = comparator_class.TRIGGERS
        for trigger in triggers:
            m = re.match(trigger, trigger_string)
            if m:
                comparator = comparator_class()
                comparator_attributes = {k: object[k] for k in comparator.REQUIRED_ATTRIBUTES}

                kwargs = m.groupdict()
                kwargs.update(comparator_attributes)

                return comparator.score(**kwargs)

    return None


def run_comparator_by_name(comparator_name, arguments, object):
    try:
        comparator_class = all_comparators.get(comparator_name)
        if comparator_class:
            comparator = comparator_class()
            comparator_attributes = {k: object[k] for k in comparator.REQUIRED_ATTRIBUTES}

            kwargs = arguments
            kwargs.update(comparator_attributes)
            return comparator.score(**kwargs)
    except Exception as e:
        traceback.print_exc()
        print(e)

    return -1


def get_comparator_by_name(comparator_name):
    return all_comparators.get(comparator_name)