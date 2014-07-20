from __future__ import absolute_import

from celery import shared_task


@shared_task
def run_comparator(comparator, attributes):
    return comparator.id, comparator.run(attributes)