import re
import pkgutil
import importlib
import itertools

comparator_list = [name for (_, name, _) in pkgutil.iter_modules([__name__])]


def get_triggers_for_comparator(comparator_name):
    comparator_triggers = importlib.import_module("{}.{}".format(__name__, comparator_name)).TRIGGERS
    return [(map(re.compile, triggers), comparator_class) for (triggers, comparator_class) in comparator_triggers]


available_triggers = list(itertools.chain(*map(get_triggers_for_comparator, comparator_list)))


def run_comparator(comparator_string, object):
    for (triggers, comparator_class) in available_triggers:
        for trigger in triggers:
            m = re.match(trigger, comparator_string)
            if m:
                comparator = comparator_class()
                comparator_attributes = {k: object[k] for k in comparator.REQUIRED_ATTRIBUTES}

                kwargs = m.groupdict()
                kwargs.update(comparator_attributes)

                return comparator.score(**kwargs)

    return None

