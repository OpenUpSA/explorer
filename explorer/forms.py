from django import forms


class ExplorerImportForm(forms.Form):
    name = forms.CharField(max_length=50, label="Dataset Name")
    csv_file = forms.FileField()
    version = forms.IntegerField()
