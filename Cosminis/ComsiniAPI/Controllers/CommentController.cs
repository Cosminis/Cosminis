using DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;

namespace Controllers;

[ApiController]
public class CommentController : ControllerBase
{
	private readonly CommentServices _commentServices;

    public CommentController(CommentServices commentServices)
    {
        _commentServices = commentServices;
    }

    [Route("/Comments/SubmitCommentForm")]
    [HttpPost]
    public ActionResult<Comment> SubmitCommentForm(int commenterID, int postsID, [FromForm]string content)
    {
        try 
        {
            Comment commentInfo = _commentServices.SubmitCommentResourceGen(commenterID, postsID, content);
            return Ok(commentInfo); 
        }
        catch(ResourceNotFound)
        {
            return NotFound("Such a user does not exist"); 
        }
        catch(PostsNotFound)
        {
            return NotFound("Such a post does not exist"); 
        }
        catch(Exception e)
        {
            return BadRequest(e.Message); 
        }
    }

    [Route("/Comments/SubmitCommentBody")]
    [HttpPost]
    public ActionResult<Comment> SubmitCommentBody(int commenterID, int postsID, [FromBody]string content)
    {
        try 
        {
            Comment commentInfo = _commentServices.SubmitCommentResourceGen(commenterID, postsID, content);
            return Ok(commentInfo); 
        }
        catch(ResourceNotFound)
        {
            return NotFound("Such a user does not exist"); 
        }
        catch(PostsNotFound)
        {
            return NotFound("Such a post does not exist"); 
        }
        catch(Exception e)
        {
            return BadRequest(e.Message); 
        }
    }

    [Route("/Comments/SubmitCommentEmpty")]
    [HttpPost]
    public ActionResult<Comment> SubmitCommentEmpty(int commenterID, int postsID, string content)
    {
        try 
        {
            Comment commentInfo = _commentServices.SubmitCommentResourceGen(commenterID, postsID, content);
            return Ok(commentInfo); 
        }
        catch(ResourceNotFound)
        {
            return NotFound("Such a user does not exist"); 
        }
        catch(PostsNotFound)
        {
            return NotFound("Such a post does not exist"); 
        }
        catch(Exception e)
        {
            return BadRequest(e.Message); 
        }
    }    

    [Route("/Comments/GetComments")]
    [HttpGet]
    public ActionResult<List<Comment>> GetCommentsByPostId(int postId)
    {
        try 
        {
            List<Comment> comments = _commentServices.GetCommentsByPostId(postId);
            return Ok(comments); 
        }
        catch(CommentsNotFound)
        {
            return NotFound("There are no comments associated with that post ID"); 
        }
    }

    [Route("/Comments/RemoveComment")]
    [HttpDelete]
    public ActionResult<bool> RemoveComment(int commentId)
    {
        try 
        {
            _commentServices.RemoveComment(commentId);
            return Ok(true); 
        }
        catch(CommentsNotFound)
        {
            return NotFound("Such a comment does not exist"); 
        }
    }     
}
