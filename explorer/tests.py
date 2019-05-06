from django.urls import reverse
from django.test import SimpleTestCase


class ExplorerHomePageTest(SimpleTestCase):
    def test_home_page(self):
        """
        request home page of explorer
        """
        response = self.client.get('/explorer', follow=True)
        self.assertEqual(response.status_code, 200)

    def test_home_page_template(self):
        """
        Check that the correct template is used
        """
        response = self.client.get('/explorer', follow=True)
        self.assertTemplateUsed(response, 'explorer/explorer.djhtml')

    def test_home_page_content(self):
        """
        Check that the page has rendered correctly
        """
        response = self.client.get('/explorer', follow=True)
        self.assertContains(response, '<div class="header item">Layers</div>')
