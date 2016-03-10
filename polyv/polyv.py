#coding: utf-8
import pkg_resources
from django.template import Context, Template

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Boolean
from xblock.fragment import Fragment


class polyvXBlock(XBlock):
    display_name = String(display_name="Display Name",
        default="polyv player",
        scope=Scope.settings,
        help="This name appears in the horizontal navigation at the top of the page.")

    vid = String(
        display_name="video vid",
        default="f54b34f5144ba4239406ca29107269ce_f",
        scope=Scope.content, #Scope.content和Scope.settings不同在于，(可见性)本课多处可用
        help="The vid for your video.")

    width = Integer(display_name="Video player width",
        default="800",
	    scope=Scope.content,
	    help="The width for your video player.")

    height = Integer(display_name="Video player height",
        default="500",
	    scope=Scope.content,
        help="The height for your video player.")

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def render_template(self, template_path, context={}):
        """
        Evaluate a template by resource path, applying the provided context
        """
        template_str = self.resource_string(template_path)
        return Template(template_str).render(Context(context))


    def student_view(self, context=None):

        context = {
            'id': ''.join(('polyvplayer', self.vid)),
            'vid': ''.join(('vid=', self.vid)),
            'width': self.width,
            'height': self.height
        }

        html = self.render_template('static/html/student.html', context)
        frag = Fragment(html)

        return frag

    def studio_view(self, context=None):

        context = {
            'display_name': self.display_name,
            'vid': self.vid,
            'width': self.width,
            'height': self.height
        }

        html = self.render_template('static/html/studio.html', context)
        frag = Fragment(html)

        frag.add_css(self.resource_string("static/css/uploadifive.css"))
        frag.add_javascript(self.resource_string("static/js/jquery.uploadifive.js"))
        frag.add_javascript(self.resource_string('static/js/studio.js'))
        frag.initialize_js('polyvXBlockInitStudio')
        return frag

    @XBlock.json_handler
    def save_polyv(self, data, suffix=''):
        """
        The saving handler.
        """
        self.vid = data['vid']
        self.width = data['width']
        self.height = data['height']

        return {
            'result': 'success',
        }

    @staticmethod
    def workbench_scenarios():
    	return [
    		("polyv de demo", "<ceui001 />")
    	]
