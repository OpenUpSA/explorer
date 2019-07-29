import json

# import geopandas
from django.contrib import admin
from django.http import JsonResponse
from django.shortcuts import render
from django.conf.urls import url

# from django.utils.safestring import mark_safe

from .models import Dataset
from .forms import ExplorerImportForm
from .process import import_csv


class ExplorerAdmin(admin.ModelAdmin):
    change_list_template = "explorer/explorer_changelist.djhtml"
    list_display = ["name"]

    # def html_data(self, obj):
    #     data = json.dumps(obj)
    #     dataframe = geopandas.read_file(data)
    #     table = dataframe.head().to_html()
    #     return table

    # def data_extract(self, obj):
    #     """
    #     Show some data from the dataset
    #     """
    #     return mark_safe(self.html_data(obj.data))

    def import_csv_dataset(self, request):
        if request.method == "POST" and request.is_ajax():
            form = ExplorerImportForm(request.POST, request.FILES)
            if form.is_valid():
                name = form.cleaned_data["name"]
                csv_file = request.FILES["csv_file"]
                version = form.cleaned_data["version"]
                try:
                    import_csv(name, csv_file, version, request.user)
                    return JsonResponse({"status": "ok"})
                except Exception as error:
                    return JsonResponse({"status": "error", "form": str(error)})

            else:
                return JsonResponse({"status": "error", "form": form.errors.as_json()})

        form = ExplorerImportForm()
        return render(request, "explorer/explorer_upload.djhtml", {"form": form})

    def get_urls(self):
        urls = super(ExplorerAdmin, self).get_urls()
        custom_urls = [
            url(
                r"^dataset-upload$",
                self.admin_site.admin_view(self.import_csv_dataset),
                name="upload",
            )
        ]
        return custom_urls + urls


admin.site.register(Dataset, ExplorerAdmin)
